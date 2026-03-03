'use client';
import { useLocalStorage } from './useLocalStorage';
import { UserProgress, LessonProgress, ActivityItem } from '@/types/progress';
import { useCallback } from 'react';

const defaultProgress: UserProgress = {
  lessons: {},
  flashcards: {},
  challenges: {},
  recentActivity: [],
};

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<UserProgress>('level-up-progress', defaultProgress);

  const addActivity = useCallback((item: Omit<ActivityItem, 'timestamp'>) => {
    setProgress(prev => ({
      ...prev,
      recentActivity: [
        { ...item, timestamp: Date.now() },
        ...prev.recentActivity,
      ].slice(0, 50),
    }));
  }, [setProgress]);

  const markLessonComplete = useCallback((slug: string, title: string) => {
    setProgress(prev => ({
      ...prev,
      lessons: {
        ...prev.lessons,
        [slug]: {
          ...prev.lessons[slug],
          slug,
          completed: true,
          quizScores: prev.lessons[slug]?.quizScores ?? {},
          lastAccessed: Date.now(),
        },
      },
    }));
    addActivity({ type: 'lesson', slug, title, detail: 'Completed' });
  }, [setProgress, addActivity]);

  const updateQuizScore = useCallback((lessonSlug: string, quizId: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      lessons: {
        ...prev.lessons,
        [lessonSlug]: {
          ...prev.lessons[lessonSlug],
          slug: lessonSlug,
          completed: prev.lessons[lessonSlug]?.completed ?? false,
          quizScores: {
            ...(prev.lessons[lessonSlug]?.quizScores ?? {}),
            [quizId]: score,
          },
          lastAccessed: Date.now(),
        },
      },
    }));
  }, [setProgress]);

  const accessLesson = useCallback((slug: string) => {
    setProgress(prev => ({
      ...prev,
      lessons: {
        ...prev.lessons,
        [slug]: {
          ...prev.lessons[slug],
          slug,
          completed: prev.lessons[slug]?.completed ?? false,
          quizScores: prev.lessons[slug]?.quizScores ?? {},
          lastAccessed: Date.now(),
        },
      },
    }));
  }, [setProgress]);

  const getLessonProgress = useCallback((slug: string): LessonProgress | undefined => {
    return progress.lessons[slug];
  }, [progress]);

  const getCompletedLessonCount = useCallback((): number => {
    return Object.values(progress.lessons).filter(l => l.completed).length;
  }, [progress]);

  return {
    progress,
    setProgress,
    markLessonComplete,
    updateQuizScore,
    accessLesson,
    getLessonProgress,
    getCompletedLessonCount,
    addActivity,
  };
}
