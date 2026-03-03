export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic: string;
}

export interface FlashcardDeck {
  topic: string;
  title: string;
  description: string;
  icon: string;
  cards: Flashcard[];
}

export interface CardState {
  cardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastReview: number;
}
