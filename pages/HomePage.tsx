import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GROUPS } from '../constants';

const HomePage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-900 overflow-hidden">
        <div className="absolute inset-0">
          <img className="w-full h-full object-cover opacity-20" src="https://picsum.photos/id/20/1920/1080" alt="University Campus" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Cổng Thông Tin Tuyển Sinh Quốc Gia
          </h1>
          <p className="max-w-2xl text-xl text-blue-100 mb-10">
            Tra cứu điểm chuẩn, so sánh ngành học và định hướng tương lai cùng trợ lý ảo AI thông minh.
          </p>
          
          {/* Main Search */}
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-2 flex items-center">
            <span className="material-symbols-outlined text-gray-400 ml-3 text-2xl">search</span>
            <input 
              type="text" 
              className="flex-1 p-4 text-lg outline-none text-gray-700 placeholder-gray-400"
              placeholder="Nhập tên trường, ngành học (VD: Bách khoa, Marketing...)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Tìm kiếm
            </button>
          </div>

          {/* Quick Filters */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {GROUPS.slice(0, 5).map(g => (
              <button 
                key={g}
                onClick={() => navigate(`/search?group=${g}`)}
                className="bg-blue-800/50 backdrop-blur-sm text-white px-4 py-1.5 rounded-full border border-blue-400/30 hover:bg-blue-700 transition text-sm font-medium"
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Trường đại học', value: '240+', icon: 'school' },
            { label: 'Ngành đào tạo', value: '3,500+', icon: 'library_books' },
            { label: 'Dữ liệu cập nhật', value: '2024', icon: 'update' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                <span className="material-symbols-outlined text-3xl">{item.icon}</span>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tính năng nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition">
                <span className="material-symbols-outlined text-4xl text-blue-600 mb-4">search</span>
                <h3 className="text-xl font-bold mb-2">Tra cứu chuẩn xác</h3>
                <p className="text-gray-600">Dữ liệu điểm chuẩn, học phí được cập nhật liên tục từ đề án tuyển sinh chính thức.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition">
                <span className="material-symbols-outlined text-4xl text-purple-600 mb-4">compare_arrows</span>
                <h3 className="text-xl font-bold mb-2">So sánh chi tiết</h3>
                <p className="text-gray-600">Đặt các trường lên bàn cân về học phí, điểm chuẩn và môi trường học tập.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition">
                <span className="material-symbols-outlined text-4xl text-pink-600 mb-4">psychology</span>
                <h3 className="text-xl font-bold mb-2">AI Hướng nghiệp</h3>
                <p className="text-gray-600">Phân tích tính cách và năng lực để gợi ý ngành nghề phù hợp nhất.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition">
                <span className="material-symbols-outlined text-4xl text-green-600 mb-4">voice_chat</span>
                <h3 className="text-xl font-bold mb-2">Tư vấn trực tiếp</h3>
                <p className="text-gray-600">Trò chuyện bằng giọng nói với AI để giải đáp thắc mắc 24/7.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
