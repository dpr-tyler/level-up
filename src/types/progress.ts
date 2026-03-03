import { CardState } from './flashcard';

export interface LessonProgress {
  slug: string;
  completed: boolean;
  quizScores: Record<string, number>;
  lastAccessed: number;
}

export interface FlashcardProgress {
  topic: string;
  cardStates: Record<string, CardState>;
  totalReviewed: number;
  lastStudied: number;
}

export interface ChallengeAttempt {
  slug: string;
  completedAt: number;
  totalScore: number;
  stepScores: Record<string, number>;
  selectedOptions: Record<string, string>;
}

export interface ChallengeProgress {
  slug: string;
  attempts: ChallengeAttempt[];
  bestScore: number;
}

export interface UserProgress {
  lessons: Record<string, LessonProgress>;
  flashcards: Record<string, FlashcardProgress>;
  challenges: Record<string, ChallengeProgress>;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  type: 'lesson' | 'flashcard' | 'challenge';
  slug: string;
  title: string;
  timestamp: number;
  detail?: string;
}
