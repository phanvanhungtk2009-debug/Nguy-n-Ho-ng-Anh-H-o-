import React, { useState } from 'react';
import GeminiChatbot from '../components/GeminiChatbot';
import LiveVoice from '../components/LiveVoice';
import ImageAnalyzer from '../components/ImageAnalyzer';

const AIAssistantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice' | 'vision'>('chat');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Trợ Lý Ảo Universe AI</h1>
        <p className="mt-2 text-gray-600">Sử dụng công nghệ AI tiên tiến nhất để hỗ trợ bạn trên con đường vào đại học.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[700px] flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-row md:flex-col gap-2">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition w-full ${activeTab === 'chat' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="material-symbols-outlined">chat</span>
            Chat Tư vấn
          </button>
          <button 
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition w-full ${activeTab === 'voice' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="material-symbols-outlined">mic</span>
            Voice Live
          </button>
          <button 
            onClick={() => setActiveTab('vision')}
            className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition w-full ${activeTab === 'vision' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="material-symbols-outlined">image_search</span>
            Phân tích điểm
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 bg-gray-50/50">
          {activeTab === 'chat' && (
            <div className="max-w-2xl mx-auto h-full">
              <GeminiChatbot />
            </div>
          )}
          {activeTab === 'voice' && (
             <div className="max-w-md mx-auto mt-10">
               <LiveVoice />
               <p className="text-center text-sm text-gray-500 mt-6 max-w-xs mx-auto">
                 Trò chuyện trực tiếp với AI để luyện phỏng vấn hoặc hỏi đáp nhanh. Hỗ trợ ngắt lời và phản hồi độ trễ thấp.
               </p>
             </div>
          )}
          {activeTab === 'vision' && (
            <div className="max-w-2xl mx-auto">
              <ImageAnalyzer />
              <div className="mt-6 text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
                <strong>Gợi ý:</strong> Chụp ảnh học bạ hoặc bảng điểm thi thử của bạn. AI sẽ tự động đọc điểm số các môn và tính điểm xét tuyển cho các khối A00, A01, D01...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
