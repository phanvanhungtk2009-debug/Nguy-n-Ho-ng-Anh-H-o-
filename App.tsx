import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import UniversityDetailPage from './pages/UniversityDetailPage';
import CareerSurveyPage from './pages/CareerSurveyPage';
import AIAssistantPage from './pages/AIAssistantPage';
import ComparePage from './pages/ComparePage';
import AdminPage from './pages/AdminPage';

// Simple Footer Component
const Footer = () => (
  <footer className="bg-gray-800 text-gray-300 py-10 mt-auto">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="mb-2 font-bold text-white">Universe VN © 2024</p>
      <p className="text-sm">Hệ thống hỗ trợ tuyển sinh đại học thông minh.</p>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/university/:id" element={<UniversityDetailPage />} />
            <Route path="/survey" element={<CareerSurveyPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;