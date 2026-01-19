import React, { useState, useRef, useEffect } from 'react';
import { getLiveSession, createBlob, decodeAudioData, b64Encode } from '../services/geminiService';
import { LiveServerMessage } from '@google/genai';

const LiveVoice: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Sẵn sàng kết nối");
  const [volume, setVolume] = useState(0);

  // Audio Context Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null); // To hold the active session
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (sessionRef.current) {
        // Need to close properly if possible, but API doesn't expose clean close on promise easily without close() method
        // Assuming session object has close()
        try { sessionRef.current.close(); } catch(e) {}
    }
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    
    setIsConnected(false);
    setStatus("Đã ngắt kết nối");
    setVolume(0);
  };

  const startSession = async () => {
    try {
      setStatus("Đang kết nối...");
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioContextRef.current = inputCtx;
      
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      // Connect to Live API
      const sessionPromise = getLiveSession({
        onopen: () => {
          setStatus("Đang trò chuyện (Live)");
          setIsConnected(true);

          const source = inputCtx.createMediaStreamSource(stream);
          const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            
            // Simple visualizer
            let sum = 0;
            for(let i=0; i<inputData.length; i++) sum += Math.abs(inputData[i]);
            setVolume(Math.min((sum / inputData.length) * 500, 100)); // Scale for UI

            const pcmBlob = createBlob(inputData);
             // Convert Blob to base64 data for `media` payload if using sendRealtimeInput with raw data object
             // BUT, SDK `sendRealtimeInput` accepts `{ media: { mimeType, data } }`.
             // The guide says `session.sendRealtimeInput({ media: pcmBlob });` which implies SDK handles Blob if typed correctly?
             // Checking guide: "session.sendRealtimeInput({ media: pcmBlob });" - Yes.
             // Wait, guide creates a pseudo-blob object: { data: string, mimeType: string }.
             // Let's stick to exactly what the guide's `createBlob` returned.
             
             // My `createBlob` in service returns a real Blob. 
             // Guide's `createBlob` returns `{ data: base64, mimeType }`.
             // I MUST FIX `createBlob` in service to return the object expected by `sendRealtimeInput` based on the provided "Runtime" code in prompt.
             
             // RE-READING PROMPT CAREFULLY:
             // The prompt's `createBlob` returns `{ data: encode(...), mimeType: ... }`. It returns a POJO, not a browser File/Blob.
             // I implemented `createBlob` in service to return `new Blob`. I must fix the service implementation or adapt here.
             // Let's adapt here to be safe and use manual encoding.

            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
            }
            const base64Data = b64Encode(new Uint8Array(int16.buffer));

            sessionPromise.then((session) => {
              session.sendRealtimeInput({ 
                  media: {
                      mimeType: 'audio/pcm;rate=16000',
                      data: base64Data
                  }
               });
            });
          };

          source.connect(scriptProcessor);
          scriptProcessor.connect(inputCtx.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          
          if (base64Audio && outputAudioContextRef.current) {
             const ctx = outputAudioContextRef.current;
             const audioBuffer = await decodeAudioData(
                 new Uint8Array(atob(base64Audio).split("").map(c => c.charCodeAt(0))),
                 ctx
             );
             
             const source = ctx.createBufferSource();
             source.buffer = audioBuffer;
             source.connect(ctx.destination);
             
             // Schedule
             const now = ctx.currentTime;
             // Ensure we don't schedule in the past
             nextStartTimeRef.current = Math.max(nextStartTimeRef.current, now);
             
             source.start(nextStartTimeRef.current);
             nextStartTimeRef.current += audioBuffer.duration;
             
             sourcesRef.current.add(source);
             source.onended = () => sourcesRef.current.delete(source);
          }
          
          if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              if(outputAudioContextRef.current) nextStartTimeRef.current = outputAudioContextRef.current.currentTime;
          }
        },
        onclose: () => {
           setStatus("Kết nối đã đóng");
           setIsConnected(false);
        },
        onerror: (err: any) => {
            console.error(err);
            setStatus("Lỗi kết nối");
        }
      });
      
      sessionRef.current = await sessionPromise;

    } catch (error) {
      console.error(error);
      setStatus("Lỗi khởi tạo: " + error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white text-center shadow-xl">
       <div className="mb-6">
         <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-300 border-4 ${isConnected ? 'border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.5)]' : 'border-gray-600'}`}>
            {isConnected ? (
                <div 
                    className="w-full h-full rounded-full bg-green-500 opacity-80"
                    style={{ transform: `scale(${0.8 + (volume / 100)})` }}
                />
            ) : (
                <span className="material-symbols-outlined text-4xl text-gray-400">mic_off</span>
            )}
         </div>
       </div>
       
       <h3 className="text-2xl font-bold mb-2">Trò chuyện trực tiếp</h3>
       <p className="text-gray-400 mb-8 h-6">{status}</p>

       {!isConnected ? (
         <button 
            onClick={startSession}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105 flex items-center gap-2 mx-auto"
         >
            <span className="material-symbols-outlined">mic</span>
            Bắt đầu trò chuyện
         </button>
       ) : (
         <button 
            onClick={cleanup}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105 flex items-center gap-2 mx-auto"
         >
            <span className="material-symbols-outlined">call_end</span>
            Kết thúc
         </button>
       )}
    </div>
  );
};

export default LiveVoice;
