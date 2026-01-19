import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_UNIVERSITIES, MOCK_MAJORS, MOCK_CUTOFFS, MOCK_TUITION } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UniversityDetailPage: React.FC = () => {
  const { id } = useParams();
  const university = MOCK_UNIVERSITIES.find(u => u.id === id);
  const majors = MOCK_MAJORS.filter(m => m.universityId === id);

  // Prepare chart data for a sample major (first one found)
  const chartData = useMemo(() => {
    if (majors.length === 0) return [];
    const sampleMajorId = majors[0].id;
    const cutoffs = MOCK_CUTOFFS.filter(c => c.majorId === sampleMajorId && c.method === 'THPT').sort((a,b) => a.year - b.year);
    return cutoffs.map(c => ({ year: c.year, score: c.score }));
  }, [majors]);

  if (!university) {
    return <div className="text-center py-20">Trường không tồn tại.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <img src={university.logo} alt={university.name} className="w-32 h-32 rounded-lg border border-gray-200 shadow-sm" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{university.name}</h1>
            <p className="text-lg text-blue-600 font-medium mt-1">{university.code} - {university.city}</p>
            <p className="text-gray-600 mt-4 leading-relaxed">{university.description}</p>
            <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
              <a href={university.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                <span className="material-symbols-outlined text-sm">language</span> Website chính thức
              </a>
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <span className="material-symbols-outlined text-sm">verified</span> Đề án tuyển sinh 2024
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Majors & Cutoffs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">list_alt</span>
              Danh sách ngành & Điểm chuẩn
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="p-4 font-semibold text-gray-700">Mã ngành</th>
                    <th className="p-4 font-semibold text-gray-700">Tên ngành</th>
                    <th className="p-4 font-semibold text-gray-700">2023</th>
                    <th className="p-4 font-semibold text-gray-700">2024</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {majors.map(major => {
                    const s2023 = MOCK_CUTOFFS.find(c => c.majorId === major.id && c.year === 2023)?.score || '-';
                    const s2024 = MOCK_CUTOFFS.find(c => c.majorId === major.id && c.year === 2024)?.score || '-';
                    return (
                      <tr key={major.id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-900">{major.code}</td>
                        <td className="p-4 text-gray-800">
                          <div className="font-medium">{major.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{major.group}</div>
                        </td>
                        <td className="p-4 text-gray-600">{s2023}</td>
                        <td className="p-4 font-bold text-blue-600">{s2024}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Xu hướng điểm chuẩn (Ngành tiêu biểu)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar: Tuition & Admission Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600">payments</span>
              Học phí tham khảo
            </h2>
            <div className="space-y-4">
              {majors.slice(0, 3).map(m => {
                const t = MOCK_TUITION.find(item => item.majorId === m.id);
                if (!t) return null;
                return (
                  <div key={m.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-gray-800 text-sm">{m.name}</p>
                    <p className="text-green-600 font-bold mt-1">
                      {t.min} - {t.max} triệu / {t.unit}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
             <h2 className="text-lg font-bold text-blue-900 mb-2">Phương thức xét tuyển</h2>
             <ul className="list-disc list-inside text-sm text-blue-800 space-y-2">
               <li>Xét tuyển thẳng (Theo quy định Bộ GD&ĐT)</li>
               <li>Xét tuyển dựa trên kết quả thi THPT 2024</li>
               <li>Xét tuyển kết hợp chứng chỉ IELTS</li>
               <li>Xét tuyển theo kết quả kỳ thi Đánh giá tư duy</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetailPage;
