import { Minus, Plus, ChevronDown, ChevronUp, Printer, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { KnowledgePoint } from '../data/knowledgePoints';
import { useAppStore } from '../store/appStore';
import { useNavigate } from 'react-router-dom';

interface KnowledgeCardProps {
  knowledgePoint: KnowledgePoint;
  isExpanded: boolean;
  onToggle: () => void;
}

export function KnowledgeCard({ knowledgePoint, isExpanded, onToggle }: KnowledgeCardProps) {
  const navigate = useNavigate();
  const {
    currentKnowledgePoint,
    questionCount,
    withAnswer,
    setKnowledgePoint,
    setQuestionCount,
    setWithAnswer,
    setExamTitle,
  } = useAppStore();

  const isSelected = currentKnowledgePoint === knowledgePoint.id;

  const handleStartPractice = () => {
    setKnowledgePoint(knowledgePoint.id);
    setExamTitle(knowledgePoint.name);
    const { generateQuestions } = useAppStore.getState();
    generateQuestions();
    navigate('/preview');
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-md border-2 transition-all duration-300 overflow-hidden',
        isSelected ? 'border-blue-400 shadow-lg' : 'border-transparent hover:border-blue-200'
      )}
    >
      <div
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className={clsx(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
          )}>
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{knowledgePoint.name}</h3>
            <p className="text-sm text-gray-500">
              {knowledgePoint.examples.slice(0, 3).join('  ')}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-2">例题</p>
            <p className="text-gray-700 font-medium">
              {knowledgePoint.examples.join('  |  ')}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-sm">题目数量</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuestionCount(questionCount - 1);
                  }}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-lg">{questionCount}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuestionCount(questionCount + 1);
                  }}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={withAnswer}
                onChange={(e) => {
                  e.stopPropagation();
                  setWithAnswer(e.target.checked);
                }}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">打印答案</span>
            </label>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStartPractice();
            }}
            className={clsx(
              'w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200',
              'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg',
              'active:scale-[0.98]'
            )}
          >
            <Printer className="w-5 h-5" />
            打印题目开始练习
          </button>
        </div>
      )}
    </div>
  );
}
