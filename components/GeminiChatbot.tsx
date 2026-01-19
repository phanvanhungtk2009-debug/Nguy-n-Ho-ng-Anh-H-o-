import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithThinking, chatWithGrounding } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const GeminiChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Xin chào! Mình là trợ lý AI. Bạn cần giúp tra cứu trường, điểm chuẩn hay tư vấn chọn ngành?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'thinking' | 'search'>('thinking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let aiResponseText = '';
      let links: { title: string; uri: string }[] | undefined = [];

      if (mode === 'thinking') {
        aiResponseText = await chatWithThinking(userMsg.text, true);
      } else {
        const result = await chatWithGrounding(userMsg.text);
        aiResponseText = result.text || "Không tìm thấy thông tin.";
        links = result.links;
      }
      
      const modelMsg: ChatMessage = { 
          role: 'model', 
          text: aiResponseText || "Xin lỗi, mình không thể trả lời câu hỏi này.",
          isThinking: mode === 'thinking',
          groundingLinks: links
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">smart_toy</span>
          <h3 className="font-bold">Trợ lý ảo Gemini</h3>
        </div>
        <div className="flex bg-blue-800/50 rounded-lg p-1 text-xs">
          <button 
            onClick={() => setMode('thinking')}
            className={`px-3 py-1 rounded-md transition ${mode === 'thinking' ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:text-white'}`}
          >
            Tư vấn sâu (Thinking)
          </button>
          <button 
            onClick={() => setMode('search')}
            className={`px-3 py-1 rounded-md transition ${mode === 'search' ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:text-white'}`}
          >
            Tin tức (Search)
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
            }`}>
              {msg.isThinking && <div className="text-xs text-blue-500 font-semibold mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">psychology</span> Thinking Mode</div>}
              {msg.role === 'model' ? (
                  <div className="markdown-body">
                     <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
              ) : (
                  msg.text
              )}

              {msg.groundingLinks && msg.groundingLinks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">Nguồn tham khảo:</p>
                  <ul className="space-y-1">
                    {msg.groundingLinks.map((link, i) => (
                      <li key={i}>
                        <a href={link.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-start gap-1">
                          <span className="material-symbols-outlined text-[12px] mt-0.5">link</span>
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
               <div className="flex space-x-1">
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            className="flex-1 border-gray-200 rounded-full px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none border"
            placeholder={mode === 'thinking' ? "Hỏi chi tiết để mình suy nghĩ..." : "Hỏi về tin tức, sự kiện..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 transition shadow-md"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatbot;
