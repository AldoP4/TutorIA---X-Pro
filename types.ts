export enum SubjectType {
  MATH = 'Matemáticas',
  SCIENCE = 'Ciencias',
  HISTORY = 'Historia',
  LANGUAGE = 'Lenguaje'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  date: string;
}

export interface SubjectProgress {
  subject: SubjectType;
  completedModules: number;
  totalModules: number;
  averageScore: number;
  recentActivity: number[]; // Array of scores for charts
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  completed: boolean;
  score?: number;
}
