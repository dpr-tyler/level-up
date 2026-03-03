'use client';
import { useLocalStorage } from './useLocalStorage';
import { FlashcardProgress } from '@/types/progress';
import { CardState } from '@/types/flashcard';
import { createInitialCardState, updateCardState } from '@/lib/spaced-repetition';
import { useCallback } from 'react';

export function useFlashcardProgress(topic: string) {
  const [flashcardData, setFlashcardData] = useLocalStorage<Record<string, FlashcardProgress>>(
    'level-up-flashcards',
    {}
  );

  const topicProgress = flashcardData[topic] ?? {
    topic,
    cardStates: {},
    totalReviewed: 0,
    lastStudied: 0,
  };

  const getCardState = useCallback((cardId: string): CardState => {
    return topicProgress.cardStates[cardId] ?? createInitialCardState(cardId);
  }, [topicProgress]);

  const rateCard = useCallback((cardId: string, quality: number) => {
    const current = topicProgress.cardStates[cardId] ?? createInitialCardState(cardId);
    const updated = updateCardState(current, quality);
    setFlashcardData(prev => ({
      ...prev,
      [topic]: {
        ...prev[topic],
        topic,
        cardStates: {
          ...(prev[topic]?.cardStates ?? {}),
          [cardId]: updated,
        },
        totalReviewed: (prev[topic]?.totalReviewed ?? 0) + 1,
        lastStudied: Date.now(),
      },
    }));
  }, [topic, topicProgress, setFlashcardData]);

  const getDueCount = useCallback((cardIds: string[]): number => {
    const now = Date.now();
    return cardIds.filter(id => {
      const state = topicProgress.cardStates[id];
      return !state || now >= state.nextReview;
    }).length;
  }, [topicProgress]);

  const getMasteredCount = useCallback((cardIds: string[]): number => {
    return cardIds.filter(id => {
      const state = topicProgress.cardStates[id];
      return state && state.repetitions >= 3;
    }).length;
  }, [topicProgress]);

  return {
    topicProgress,
    getCardState,
    rateCard,
    getDueCount,
    getMasteredCount,
    flashcardData,
  };
}
