
export enum AppView {
  DASHBOARD = 'dashboard',
  LESSONS = 'lessons',
  VOCABULARY = 'vocabulary',
  CONVERSATION = 'conversation',
  PRACTICE = 'practice'
}

export interface Phrase {
  id: string;
  hindi: string;
  english: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  hindiTitle: string;
  icon: string;
  phrases: Phrase[];
}

export interface VocabWord {
  id: string;
  hindi: string;
  english: string;
  example: string;
}

export interface UserProgress {
  completedLessons: string[];
  totalPoints: number;
  streak: number;
}
