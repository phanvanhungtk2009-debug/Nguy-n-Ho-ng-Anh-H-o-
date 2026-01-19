import React, { useMemo } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { MOCK_UNIVERSITIES, MOCK_MAJORS, MOCK_CUTOFFS, MOCK_TUITION } from '../constants';

const ComparePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ids = searchParams.get('ids')?.split(',') || [];

  const universities = useMemo(() => {
    return ids.map(id => MOCK_UNIVERSITIES.find(u => u.id === id)).filter(Boolean);
  }, [ids]);

  if (universities.length === 0) {
    return <Navigate to="/search" replace />;
  }

  // Helper to get aggregated stats for a university
  const getUniStats = (uniId: string) => {
    const uniMajors = MOCK_MAJORS.filter(m => m.universityId === uniId);
    const majorIds = uniMajors.map(m => m.id);
    
    // Tuition Range
    const tuitionList = MOCK_TUITION.filter(t => majorIds.includes(t.majorId));
    const minTuition = tuitionList.length ? Math.min(...tuitionList.map(t => t.min)) : 0;
    const maxTuition = tuitionList.length ? Math.max(...tuitionList.map(t => t.max)) : 0;

    // Cutoff Range (2024)
    const cutoffList = MOCK_CUTOFFS.filter(c => majorIds.includes(c.majorId) && c.year === 2024 && c.method === 'THPT');
    const minScore = cutoffList.length ? Math.min(...cutoffList.map(c => c.score)) : 0;
    const maxScore = cutoffList.length ? Math.max(...cutoffList.map(c => c.score)) : 0;

    // Combinations
    const combinations = new Set<string>();
    cutoffList.forEach(c => c.combinations.forEach(cmb => combinations.add(cmb)));

    return {
      majorCount: uniMajors.length,
      tuition: tuitionList.length ? `${minTuition} - ${maxTuition} triệu/năm` : 'Chưa cập nhật',
      scoreRange: cutoffList.length ? `${minScore} - ${maxScore}` : 'Chưa cập nhật',
      combinations: Array.from(combinations).sort().join(', '),
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
         <h1 className="text-3xl font-bold text-gray-900">So sánh trường đại học</h1>
         <Link to="/search" className="text-blue-600 hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined">arrow_back</span> Thêm trường khác
         </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-100 bg-gray-50 w-48 sticky left-0 z-10 text-gray-500 font-medium">Tiêu chí</th>
              {universities.map((uni: any) => (
                <th key={uni.id} className="p-6 border-b border-gray-100 min-w-[250px] align-top">
                  <div className="flex flex-col items-center text-center">
                    <img src={uni.logo} alt={uni.code} className="w-20 h-20 object-cover rounded-full border border-gray-100 shadow-sm mb-3" />
                    <h3 className="font-bold text-lg text-gray-900">{uni.name}</h3>
                    <span className="text-sm text-gray-500 font-medium mt-1">{uni.code}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {/* General Info */}
            <tr>
              <td className="p-4 bg-gray-50 font-semibold sticky left-0">Tỉnh/Thành phố</td>
              {universities.map((uni: any) => (
                <td key={uni.id} className="p-4 text-center">{uni.city}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 font-semibold sticky left-0">Loại hình</td>
              {universities.map((uni: any) => (
                <td key={uni.id} className="p-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${uni.type === 'Public' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                    {uni.type === 'Public' ? 'Công lập' : 'Tư thục'}
                  </span>
                </td>
              ))}
            </tr>
            
            {/* Stats */}
            <tr>
              <td className="p-4 bg-gray-50 font-semibold sticky left-0">Học phí (tham khảo)</td>
              {universities.map((uni: any) => (
                <td key={uni.id} className="p-4 text-center font-medium text-green-700">
                  {getUniStats(uni.id).tuition}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 font-semibold sticky left-0">Điểm chuẩn (2024)</td>
              {universities.map((uni: any) => (
                <td key={uni.id} className="p-4 text-center font-bold text-blue-700">
                  {getUniStats(uni.id).scoreRange}
                </td>
              ))}
            </tr>
             <tr>
              <td className="p-4 bg-gray-50 font-semibold sticky left-0">Số ngành đào tạo</td>
              {universities.map((uni: any) => (
                <td key={uni.id} className="p-4 text-center">
                  {getUniStats(uni.id).majorCount} ngành
                </td>
              ))}
            </tr>
             <tr>
              <td className="p-4 bg-gray-50 font-semibold sticky left-0">Tổ hợp môn xét tuyển</td>
              {universities.map((uni: any) => (
                <td key={uni.id} className="p-4 text-center text-xs leading-relaxed text-gray-500">
                  {getUniStats(uni.id).combinations}
                </td>
              ))}
            </tr>
            
            {/* Description */}
            <tr>
              <td className="p-4 bg-gray-50 font-semibold sticky left-0 align-top">Giới thiệu</td>
              {universities.map((uni: any) => (
                <td key={uni.id} className="p-4 text-left align-top text-gray-600 leading-relaxed text-xs">
                  {uni.description}
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr>
               <td className="p-4 bg-gray-50 sticky left-0"></td>
               {universities.map((uni: any) => (
                <td key={uni.id} className="p-4 text-center">
                   <Link to={`/university/${uni.id}`} className="block w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition">
                     Xem chi tiết
                   </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;