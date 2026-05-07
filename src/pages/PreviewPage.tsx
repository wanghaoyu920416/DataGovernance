import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, RefreshCw, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { versions } from '../data/knowledgePoints';
import { exportToWord, downloadBlob } from '../utils/docxExporter';
import { useState } from 'react';

export function PreviewPage() {
  const navigate = useNavigate();
  const { questions, withAnswer, examTitle, currentVersion, generateQuestions } = useAppStore();
  const [isExporting, setIsExporting] = useState(false);

  const version = versions.find((v) => v.id === currentVersion);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportToWord({
        title: `${version?.displayName} - ${examTitle}`,
        questions,
        withAnswer,
        type: 'oral',
      });
      const filename = `${version?.displayName}_${examTitle}_${Date.now()}.docx`;
      downloadBlob(blob, filename);
      navigate('/export');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRegenerate = () => {
    generateQuestions();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-40 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">题目预览</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
            <h2 className="text-xl font-bold text-center">
              {version?.displayName} - {examTitle}
            </h2>
            <p className="text-center text-blue-100 mt-1">
              共 {questions.length} 题
            </p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-600 print:text-black">
                姓名: ________________ &nbsp;&nbsp; 日期: ________________ &nbsp;&nbsp; 用时: ____分____秒
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-4 print:p-0">
              {questions.map((q, idx) => (
                <div key={q.id} className="py-3 px-2 border-b border-gray-100 print:border-none print:min-h-[2em]">
                  <span className="text-gray-500 text-sm mr-2">{idx + 1}.</span>
                  <span className="font-medium text-gray-800 print:text-black">{q.content}</span>
                  {withAnswer && (
                    <span className="ml-2 text-blue-600 font-semibold">{q.answer}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {withAnswer && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
              <h2 className="text-lg font-bold text-center">参考答案</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {questions.map((q, idx) => (
                  <div key={`ans-${q.id}`} className="py-3 px-2">
                    <span className="text-gray-500 text-sm mr-2">{idx + 1}.</span>
                    <span className="font-medium text-gray-800">{q.content}</span>
                    <span className="ml-2 text-green-600 font-semibold">{q.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
          <button
            onClick={handleRegenerate}
            className="py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            重新生成
          </button>
          <button
            onClick={handlePrint}
            className="py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md"
          >
            <Printer className="w-5 h-5" />
            直接打印
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-md disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {isExporting ? '导出中...' : '导出Word'}
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white transition-all shadow-md"
          >
            <Download className="w-5 h-5" />
            保存PDF
          </button>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 rounded-lg print:hidden">
          <p className="text-sm text-yellow-700 text-center">
            💡 提示：点击"保存PDF"或"直接打印"后，选择"另存为PDF"即可保存文件
          </p>
        </div>
      </main>
    </div>
  );
}
