'use client';
import { useLocalStorage } from './useLocalStorage';
import { ChallengeProgress, ChallengeAttempt } from '@/types/progress';
import { useCallback } from 'react';

export function useChallengeProgress() {
  const [challengeData, setChallengeData] = useLocalStorage<Record<string, ChallengeProgress>>(
    'level-up-challenges',
    {}
  );

  const recordAttempt = useCallback((attempt: ChallengeAttempt) => {
    setChallengeData(prev => {
      const existing = prev[attempt.slug];
      const attempts = [...(existing?.attempts ?? []), attempt];
      const bestScore = Math.max(existing?.bestScore ?? 0, attempt.totalScore);
      return {
        ...prev,
        [attempt.slug]: { slug: attempt.slug, attempts, bestScore },
      };
    });
  }, [setChallengeData]);

  const getChallengeProgress = useCallback((slug: string): ChallengeProgress | undefined => {
    return challengeData[slug];
  }, [challengeData]);

  const getBestScore = useCallback((slug: string): number => {
    return challengeData[slug]?.bestScore ?? 0;
  }, [challengeData]);

  const getAttemptCount = useCallback((slug: string): number => {
    return challengeData[slug]?.attempts.length ?? 0;
  }, [challengeData]);

  return {
    challengeData,
    recordAttempt,
    getChallengeProgress,
    getBestScore,
    getAttemptCount,
  };
}
