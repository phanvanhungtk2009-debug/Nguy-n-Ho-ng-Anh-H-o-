import React from 'react';
import { CITIES, GROUPS, COMBINATIONS } from '../constants';
import { SearchFilters as SearchFiltersType } from '../types';

interface Props {
  filters: SearchFiltersType;
  setFilters: (f: SearchFiltersType) => void;
}

const SearchFilters: React.FC<Props> = ({ filters, setFilters }) => {
  const handleChange = (field: keyof SearchFiltersType, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-gray-500">filter_alt</span>
        <h2 className="font-semibold text-gray-800">Bộ lọc tìm kiếm</h2>
      </div>

      <div className="space-y-4">
        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
          <select 
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
          >
            <option value="">Tất cả</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Group Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Khối ngành</label>
          <div className="flex flex-wrap gap-2">
            {GROUPS.map(g => (
              <button
                key={g}
                onClick={() => handleChange('group', filters.group === g ? '' : g)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  filters.group === g 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Combination Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tổ hợp môn</label>
          <select 
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
            value={filters.combination}
            onChange={(e) => handleChange('combination', e.target.value)}
          >
            <option value="">Tất cả</option>
            {COMBINATIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        
        <button 
            onClick={() => setFilters({ keyword: '', city: '', group: '', combination: '' })}
            className="w-full mt-4 text-sm text-gray-500 hover:text-red-500 underline"
        >
            Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
