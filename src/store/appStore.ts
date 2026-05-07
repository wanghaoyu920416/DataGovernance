import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question, generateQuestions } from '../utils/questionGenerator';

interface AppState {
  currentVersion: string;
  currentKnowledgePoint: string;
  questionCount: number;
  withAnswer: boolean;
  questions: Question[];
  examTitle: string;
  
  setVersion: (versionId: string) => void;
  setKnowledgePoint: (kpId: string) => void;
  setQuestionCount: (count: number) => void;
  setWithAnswer: (withAnswer: boolean) => void;
  generateQuestions: () => void;
  setExamTitle: (title: string) => void;
  reset: () => void;
}

const DEFAULT_VERSION = 'pre-school';
const DEFAULT_KP = 'add-5';
const DEFAULT_COUNT = 10;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentVersion: DEFAULT_VERSION,
      currentKnowledgePoint: DEFAULT_KP,
      questionCount: DEFAULT_COUNT,
      withAnswer: false,
      questions: [],
      examTitle: '',

      setVersion: (versionId: string) => {
        set({ currentVersion: versionId, questions: [] });
      },

      setKnowledgePoint: (kpId: string) => {
        set({ currentKnowledgePoint: kpId, questions: [] });
      },

      setQuestionCount: (count: number) => {
        set({ questionCount: Math.max(1, Math.min(100, count)) });
      },

      setWithAnswer: (withAnswer: boolean) => {
        set({ withAnswer });
      },

      generateQuestions: () => {
        const { currentKnowledgePoint, questionCount } = get();
        const questions = generateQuestions(currentKnowledgePoint, questionCount);
        set({ questions });
      },

      setExamTitle: (title: string) => {
        set({ examTitle: title });
      },

      reset: () => {
        set({
          currentVersion: DEFAULT_VERSION,
          currentKnowledgePoint: DEFAULT_KP,
          questionCount: DEFAULT_COUNT,
          withAnswer: false,
          questions: [],
          examTitle: '',
        });
      },
    }),
    {
      name: 'math-practice-storage',
      partialize: (state) => ({
        currentVersion: state.currentVersion,
        currentKnowledgePoint: state.currentKnowledgePoint,
        questionCount: state.questionCount,
        withAnswer: state.withAnswer,
      }),
    }
  )
);
