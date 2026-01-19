import { GoogleGenAI, Type, FunctionDeclaration, Modality, LiveServerMessage } from "@google/genai";

// Helper to get AI instance - ensuring API key is present
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Text Chat with Thinking Mode (gemini-3-pro-preview)
export const chatWithThinking = async (prompt: string, useThinking: boolean = true) => {
  const ai = getAIClient();
  const modelId = 'gemini-3-pro-preview';
  
  const config: any = {
    systemInstruction: "Bạn là chuyên gia tư vấn tuyển sinh đại học tại Việt Nam. Hãy trả lời chính xác, ngắn gọn và hữu ích.",
  };

  if (useThinking) {
    config.thinkingConfig = { thinkingBudget: 16000 }; // Use a reasonable budget for demo
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: config
    });
    return response.text;
  } catch (error) {
    console.error("Thinking chat error:", error);
    throw error;
  }
};

// 2. Chat with Google Search Grounding (gemini-3-flash-preview)
export const chatWithGrounding = async (prompt: string) => {
  const ai = getAIClient();
  const modelId = 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text;
    // Extract grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = groundingChunks
      .map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter((item: any) => item !== null);

    return { text, links };
  } catch (error) {
    console.error("Grounding chat error:", error);
    throw error;
  }
};

// 3. Career Counseling Logic (Survey Analysis) - Using Gemini 3 Pro
export const analyzeCareerSurvey = async (answers: string[]) => {
  const ai = getAIClient();
  const prompt = `
    Dựa trên các câu trả lời khảo sát sau của một học sinh cấp 3 Việt Nam, hãy gợi ý 3 nhóm ngành phù hợp nhất và giải thích ngắn gọn tại sao.
    Các câu trả lời: ${JSON.stringify(answers)}
    
    Hãy trả về định dạng JSON:
    {
      "personality": "Mô tả ngắn về tính cách",
      "recommendations": [
        { "field": "Tên nhóm ngành", "reason": "Lý do phù hợp", "suggestedMajors": ["Ngành A", "Ngành B"] }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personality: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  field: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  suggestedMajors: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Survey analysis error:", error);
    throw error;
  }
};

// 4. Image Analysis (Score Report/Transcript) - gemini-3-pro-preview
export const analyzeImageDocument = async (base64Image: string, mimeType: string) => {
  const ai = getAIClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: "Đây là ảnh chụp bảng điểm hoặc giấy tờ học tập. Hãy trích xuất thông tin điểm số các môn học và tính điểm trung bình các khối A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh), D01 (Toán, Văn, Anh). Nếu không phải bảng điểm, hãy mô tả ảnh." }
        ]
      },
      config: {
        // Can be adjusted if we want JSON output
      }
    });
    return response.text;
  } catch (error) {
    console.error("Image analysis error:", error);
    throw error;
  }
};

// 5. Live Voice API Helpers
// These are utility functions for the LiveVoice component
export const createBlob = (data: Float32Array): Blob => {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return new Blob([int16], { type: 'audio/pcm' });
};

export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

export const b64Decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const b64Encode = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const getLiveSession = async (callbacks: any) => {
  const ai = getAIClient();
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
      systemInstruction: 'Bạn là một trợ lý tuyển sinh ảo nhiệt tình, nói tiếng Việt, giúp học sinh giải đáp thắc mắc về chọn trường đại học.',
    },
  });
};
