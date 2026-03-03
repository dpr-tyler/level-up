import { CardState } from '@/types/flashcard';

export function createInitialCardState(cardId: string): CardState {
  return {
    cardId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now(),
    lastReview: 0,
  };
}

// quality: 1-5 (1=again, 2=hard, 3=good, 4=easy, 5=perfect)
export function updateCardState(state: CardState, quality: number): CardState {
  const q = Math.max(1, Math.min(5, quality));
  let { easeFactor, interval, repetitions } = state;

  if (q < 3) {
    repetitions = 0;
    interval = 0;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    cardId: state.cardId,
    easeFactor,
    interval,
    repetitions,
    nextReview,
    lastReview: Date.now(),
  };
}

export function isDue(state: CardState): boolean {
  return Date.now() >= state.nextReview;
}

export function sortByDue(states: CardState[]): CardState[] {
  return [...states].sort((a, b) => a.nextReview - b.nextReview);
}
