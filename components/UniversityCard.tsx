import React from 'react';
import { Link } from 'react-router-dom';
import { University } from '../types';

interface Props {
  university: University;
  onCompare?: (u: University) => void;
  isComparing?: boolean;
}

const UniversityCard: React.FC<Props> = ({ university, onCompare, isComparing }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={university.logo} 
            alt={university.name} 
            className="w-16 h-16 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight">
              <Link to={`/university/${university.id}`} className="hover:text-blue-600">
                {university.name}
              </Link>
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                {university.code}
              </span>
              <span className="text-xs text-gray-500">{university.city}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${university.type === 'Public' ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'}`}>
                {university.type === 'Public' ? 'Công lập' : 'Tư thục'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-4 text-sm text-gray-600 line-clamp-2">
        {university.description}
      </p>

      <div className="mt-5 flex gap-3">
        <Link 
          to={`/university/${university.id}`}
          className="flex-1 text-center bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
        >
          Chi tiết
        </Link>
        <button 
          onClick={() => onCompare && onCompare(university)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
            isComparing 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {isComparing ? 'Đã chọn' : 'So sánh'}
        </button>
      </div>
    </div>
  );
};

export default UniversityCard;
