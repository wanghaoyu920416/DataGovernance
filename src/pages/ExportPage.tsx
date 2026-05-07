import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Printer, Download } from 'lucide-react';

export function ExportPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">导出成功！</h1>
        <p className="text-gray-500 mb-8">
          Word文档已生成并下载，请查看下载文件夹中的文件
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-md"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
          <button
            onClick={() => navigate('/preview')}
            className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
          >
            <Download className="w-5 h-5" />
            重新导出
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-600">
            💡 提示：下载的Word文件可直接用Word或WPS打开，支持直接打印
          </p>
        </div>
      </div>
    </div>
  );
}
