import React, { useState } from 'react';
import { analyzeCareerSurvey } from '../services/geminiService';

const QUESTIONS = [
  "Bạn thích làm việc với con số hay con người hơn?",
  "Bạn có thích mày mò, sửa chữa đồ điện tử không?",
  "Bạn có khả năng thuyết trình trước đám đông không?",
  "Bạn thích môi trường làm việc ổn định hay nhiều thử thách?",
  "Môn học yêu thích nhất của bạn ở trường là gì?",
  "Bạn có sẵn sàng làm thêm giờ để hoàn thành dự án không?",
  "Bạn quan tâm đến mức lương cao ngay lập tức hay lộ trình thăng tiến lâu dài?"
];

const CareerSurveyPage: React.FC = () => {
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(''));
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.some(a => !a.trim())) {
      alert("Vui lòng trả lời hết các câu hỏi!");
      return;
    }
    setLoading(true);
    try {
      const data = await analyzeCareerSurvey(answers);
      setResult(data);
    } catch (e) {
      alert("Lỗi khi phân tích. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Khảo sát Hướng nghiệp AI</h1>
        <p className="mt-2 text-gray-600">Trả lời vài câu hỏi để Gemini phân tích và gợi ý ngành nghề phù hợp với bạn.</p>
      </div>

      {!result ? (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="space-y-6">
            {QUESTIONS.map((q, idx) => (
              <div key={idx}>
                <label className="block font-medium text-gray-800 mb-2">{idx + 1}. {q}</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Câu trả lời của bạn..."
                  value={answers[idx]}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg hover:opacity-90 transition"
          >
            {loading ? 'Đang phân tích...' : 'Xem kết quả'}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-2xl text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Kết quả phân tích</h2>
            <p className="text-lg opacity-90 italic">"{result.personality}"</p>
          </div>

          <div className="grid gap-6">
            {result.recommendations?.map((rec: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{rec.field}</h3>
                <p className="text-gray-600 mb-4 text-sm">{rec.reason}</p>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngành gợi ý:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rec.suggestedMajors.map((m: string) => (
                      <span key={m} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setResult(null)}
            className="block mx-auto mt-8 text-blue-600 font-medium hover:underline"
          >
            Làm lại khảo sát
          </button>
        </div>
      )}
    </div>
  );
};

export default CareerSurveyPage;
