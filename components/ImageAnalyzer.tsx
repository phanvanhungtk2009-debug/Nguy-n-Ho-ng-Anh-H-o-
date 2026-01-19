import React, { useState } from 'react';
import { analyzeImageDocument } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(''); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // image is "data:image/png;base64,..."
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      
      const text = await analyzeImageDocument(base64Data, mimeType);
      setResult(text);
    } catch (err) {
      setResult('Có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-blue-600">document_scanner</span>
        Phân tích bảng điểm / Học bạ
      </h3>
      
      <div className="mb-4">
        <label className="block w-full cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-100 transition text-center">
            <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">upload_file</span>
            <p className="text-sm text-gray-500">Nhấn để tải lên ảnh (PNG, JPG)</p>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>

      {image && (
        <div className="mb-4">
            <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
                <img src={image} alt="Uploaded" className="h-full w-full object-contain" />
            </div>
            <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
                {loading ? 'Đang phân tích...' : 'Phân tích điểm số'}
            </button>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="markdown-body text-sm text-gray-800">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
