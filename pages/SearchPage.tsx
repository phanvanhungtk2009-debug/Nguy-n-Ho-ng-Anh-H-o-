import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchFilters from '../components/SearchFilters';
import UniversityCard from '../components/UniversityCard';
import { MOCK_UNIVERSITIES } from '../constants';
import { SearchFilters as SearchFiltersType, University } from '../types';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SearchFiltersType>({
    keyword: searchParams.get('keyword') || '',
    city: searchParams.get('city') || '',
    group: searchParams.get('group') || '',
    combination: '',
  });

  // Sync state with URL param on mount only
  useEffect(() => {
    const k = searchParams.get('keyword');
    const g = searchParams.get('group');
    if (k) setFilters(prev => ({...prev, keyword: k}));
    if (g) setFilters(prev => ({...prev, group: g}));
  }, [searchParams]);

  // Handle local comparison state (simple implementation)
  const [compareList, setCompareList] = useState<University[]>([]);

  const toggleCompare = (uni: University) => {
    setCompareList(prev => {
      const exists = prev.find(u => u.id === uni.id);
      if (exists) return prev.filter(u => u.id !== uni.id);
      if (prev.length >= 3) {
        alert("Chỉ có thể so sánh tối đa 3 trường!");
        return prev;
      }
      return [...prev, uni];
    });
  };

  const filteredUniversities = useMemo(() => {
    return MOCK_UNIVERSITIES.filter(uni => {
      const matchKeyword = filters.keyword 
        ? uni.name.toLowerCase().includes(filters.keyword.toLowerCase()) || uni.code.toLowerCase().includes(filters.keyword.toLowerCase())
        : true;
      const matchCity = filters.city ? uni.city === filters.city : true;
      return matchKeyword && matchCity;
    });
  }, [filters]);

  const handleCompareClick = () => {
    const ids = compareList.map(u => u.id).join(',');
    navigate(`/compare?ids=${ids}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <SearchFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Kết quả tìm kiếm ({filteredUniversities.length})
            </h1>
            
            {/* Quick Keyword Input if user wants to refine here */}
            <div className="relative">
                <input 
                    type="text"
                    placeholder="Tìm tên trường..."
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:border-blue-500"
                    value={filters.keyword}
                    onChange={(e) => setFilters(prev => ({...prev, keyword: e.target.value}))}
                />
            </div>
          </div>

          <div className="space-y-6">
            {filteredUniversities.map(uni => (
              <UniversityCard 
                key={uni.id} 
                university={uni} 
                onCompare={toggleCompare}
                isComparing={!!compareList.find(u => u.id === uni.id)}
              />
            ))}
            {filteredUniversities.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                    <p className="text-gray-500">Không tìm thấy trường nào phù hợp.</p>
                </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Compare Floating Button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-8 right-8 z-40 bg-white p-4 rounded-xl shadow-2xl border border-blue-100 flex items-center gap-4 animate-bounce-in ring-2 ring-blue-100">
          <div>
            <p className="text-sm font-semibold text-gray-800">So sánh {compareList.length} trường</p>
            <div className="flex -space-x-2 mt-1">
              {compareList.map(u => (
                <img key={u.id} src={u.logo} alt={u.code} className="w-8 h-8 rounded-full border-2 border-white object-cover bg-white" />
              ))}
            </div>
          </div>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition shadow-sm"
            onClick={handleCompareClick}
          >
            Xem ngay
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;