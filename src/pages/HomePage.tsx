import { useState } from 'react';
import { VersionSelector } from '../components/VersionSelector';
import { KnowledgeCard } from '../components/KnowledgeCard';
import { useAppStore } from '../store/appStore';
import { versions } from '../data/knowledgePoints';
import { Calculator, Sparkles } from 'lucide-react';

export function HomePage() {
  const { currentVersion } = useAppStore();
  const [expandedKP, setExpandedKP] = useState<string | null>(null);

  const currentVersionData = versions.find((v) => v.id === currentVersion);

  const toggleKP = (kpId: string) => {
    setExpandedKP(expandedKP === kpId ? null : kpId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calculator className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">儿童口算练习</h1>
                <p className="text-sm text-gray-500">支持口算+竖式+Word打印</p>
              </div>
            </div>
            <VersionSelector />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-lg font-semibold">{currentVersionData?.displayName}</h2>
          </div>
          <p className="text-blue-100">
            共 {currentVersionData?.knowledgePoints.length || 0} 个知识点，点击展开设置题目数量
          </p>
        </div>

        <div className="space-y-4">
          {currentVersionData?.knowledgePoints.map((kp) => (
            <KnowledgeCard
              key={kp.id}
              knowledgePoint={kp}
              isExpanded={expandedKP === kp.id}
              onToggle={() => toggleKP(kp.id)}
            />
          ))}
        </div>

        <div className="mt-8 p-6 bg-white rounded-2xl shadow-md">
          <h3 className="font-semibold text-gray-800 mb-3">使用说明</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">1.</span>
              选择对应的教材版本
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">2.</span>
              点击知识点卡片展开设置
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">3.</span>
              调整题目数量，勾选是否打印答案
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">4.</span>
              点击「打印题目开始练习」生成练习卷
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">5.</span>
              预览后可导出Word文件或直接打印
            </li>
          </ul>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-400 text-sm">
        <p>儿童口算练习小程序 · 支持学前至二年级</p>
      </footer>
    </div>
  );
}
