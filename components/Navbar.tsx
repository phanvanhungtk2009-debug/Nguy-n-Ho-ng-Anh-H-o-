import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="material-symbols-outlined text-blue-600 text-3xl mr-2">school</span>
              <span className="font-bold text-xl text-gray-800">Universe VN</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8 items-center">
              <Link to="/search" className={isActive('/search')}>Tra cứu</Link>
              <Link to="/compare" className={isActive('/compare')}>So sánh</Link>
              <Link to="/survey" className={isActive('/survey')}>Hướng nghiệp</Link>
              <Link to="/ai-assistant" className={`${isActive('/ai-assistant')} flex items-center gap-1`}>
                <span className="material-symbols-outlined text-sm">sparkles</span> AI Assistant
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <Link to="/admin" className="text-gray-500 hover:text-gray-700 flex items-center" title="Admin Dashboard">
               <span className="material-symbols-outlined">admin_panel_settings</span>
             </Link>
             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
               Đăng nhập
             </button>
          </div>
        </div>
      </div>
      {/* Mobile menu could go here */}
    </nav>
  );
};

export default Navbar;