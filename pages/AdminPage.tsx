import React, { useState, useEffect } from 'react';

// Mock data for notifications
const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'success', message: 'Cập nhật điểm chuẩn NEU 2024 thành công.', time: '10 phút trước' },
  { id: 2, type: 'info', message: 'Phát hiện đề án tuyển sinh mới từ Đại học Ngoại Thương.', time: '1 giờ trước' },
  { id: 3, type: 'warning', message: 'HUST: Cấu trúc dữ liệu học phí thay đổi. Cần kiểm tra thủ công.', time: '2 giờ trước' },
  { id: 4, type: 'success', message: 'Đồng bộ dữ liệu Bộ GD&ĐT hoàn tất.', time: '5 giờ trước' },
];

const AdminPage: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString('vi-VN'));
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleManualSync = () => {
    setIsSyncing(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsSyncing(false);
      setLastUpdated(new Date().toLocaleString('vi-VN'));
      setNotifications(prev => [
        { id: Date.now(), type: 'success', message: 'Đồng bộ thủ công hoàn tất.', time: 'Vừa xong' },
        ...prev
      ]);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản trị Hệ thống Dữ liệu</h1>
        <p className="text-gray-500 mt-2">Giám sát và cập nhật tự động dữ liệu tuyển sinh từ các nguồn chính thống.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Status Panel */}
        <div className="md:col-span-2 space-y-6">
          {/* Data Sources Monitor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">dns</span>
              Trạng thái nguồn dữ liệu
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-green-200 bg-green-50 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-800">Cổng Bộ GD&ĐT</p>
                  <p className="text-xs text-green-600">Đang hoạt động</p>
                </div>
                <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
              </div>
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-800">Website Trường ĐH</p>
                  <p className="text-xs text-blue-600">Theo dõi: 142/150 trường</p>
                </div>
                <div className="relative">
                   <span className="material-symbols-outlined text-blue-600 text-3xl">language</span>
                   <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Tiến trình cập nhật hôm nay</span>
                <span className="text-sm text-blue-600 font-bold">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600">settings</span>
              Cấu hình tự động hóa
            </h2>
            
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Tự động cập nhật</p>
                <p className="text-sm text-gray-500">Quét dữ liệu mới mỗi 24 giờ</p>
              </div>
              <button 
                onClick={() => setAutoUpdate(!autoUpdate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoUpdate ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${autoUpdate ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="font-medium text-gray-900">Đồng bộ thủ công</p>
                <p className="text-sm text-gray-500">Cập nhật lần cuối: {lastUpdated}</p>
              </div>
              <button 
                onClick={handleManualSync}
                disabled={isSyncing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition ${isSyncing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <span className={`material-symbols-outlined ${isSyncing ? 'animate-spin' : ''}`}>refresh</span>
                {isSyncing ? 'Đang xử lý...' : 'Quét ngay'}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500">notifications</span>
                Thông báo
              </h2>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{notifications.length}</span>
           </div>
           
           <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
             {notifications.map(notif => (
               <div key={notif.id} className="flex gap-3 items-start p-3 rounded-lg bg-gray-50 border border-gray-100">
                  {notif.type === 'success' && <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check_circle</span>}
                  {notif.type === 'info' && <span className="material-symbols-outlined text-blue-500 text-sm mt-0.5">info</span>}
                  {notif.type === 'warning' && <span className="material-symbols-outlined text-orange-500 text-sm mt-0.5">warning</span>}
                  
                  <div>
                    <p className="text-sm text-gray-800 leading-snug">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>
               </div>
             ))}
           </div>
           
           <button className="w-full mt-4 text-center text-sm text-blue-600 hover:underline">Xem tất cả</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;