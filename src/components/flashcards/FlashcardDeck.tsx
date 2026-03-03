'use client';
import { useState, useMemo } from 'react';
import { Flashcard } from '@/types/flashcard';
import { FlashcardCard } from './FlashcardCard';
import { ConfidenceRating } from './ConfidenceRating';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useFlashcardProgress } from '@/hooks/useFlashcardProgress';
import { isDue } from '@/lib/spaced-repetition';

interface FlashcardDeckProps {
  topic: string;
  cards: Flashcard[];
  onComplete?: () => void;
}

export function FlashcardDeck({ topic, cards, onComplete }: FlashcardDeckProps) {
  const { getCardState, rateCard } = useFlashcardProgress(topic);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  const studyCards = useMemo(() => {
    const due = cards.filter(c => {
      const state = getCardState(c.id);
      return isDue(state);
    });
    return due.length > 0 ? due : cards;
  }, [cards, getCardState]);

  const currentCard = studyCards[currentIndex];

  const handleRate = (quality: number) => {
    rateCard(currentCard.id, quality);
    setReviewed(prev => prev + 1);
    setFlipped(false);

    if (currentIndex + 1 >= studyCards.length) {
      setSessionComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (sessionComplete) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">Session Complete!</h2>
        <p className="text-zinc-400 mb-6">You reviewed {reviewed} cards</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => { setCurrentIndex(0); setSessionComplete(false); setReviewed(0); setFlipped(false); }}>
            Study Again
          </Button>
          <Button onClick={onComplete}>Back to Decks</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-zinc-500">Card {currentIndex + 1} of {studyCards.length}</span>
        <span className="text-sm text-zinc-500">{reviewed} reviewed</span>
      </div>
      <ProgressBar value={currentIndex} max={studyCards.length} size="sm" color="blue" className="mb-8" />

      <FlashcardCard
        front={currentCard.front}
        back={currentCard.back}
        flipped={flipped}
        onFlip={() => setFlipped(!flipped)}
      />

      {flipped && <ConfidenceRating onRate={handleRate} />}

      {!flipped && (
        <p className="text-center text-sm text-zinc-600 mt-4">Click the card to reveal the answer</p>
      )}
    </div>
  );
}
