'use client';
import { useState } from 'react';

interface FlashcardCardProps {
  front: string;
  back: string;
  flipped?: boolean;
  onFlip?: () => void;
}

export function FlashcardCard({ front, back, flipped: controlledFlipped, onFlip }: FlashcardCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isFlipped = controlledFlipped ?? internalFlipped;

  const handleClick = () => {
    if (onFlip) {
      onFlip();
    } else {
      setInternalFlipped(!internalFlipped);
    }
  };

  return (
    <div
      className="w-full max-w-lg mx-auto cursor-pointer select-none"
      style={{ perspective: '1200px' }}
      onClick={handleClick}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          minHeight: '280px',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-4 font-medium">Question</div>
          <p className="text-xl text-zinc-100 text-center font-medium leading-relaxed">{front}</p>
          <div className="absolute bottom-4 text-xs text-zinc-600">Tap to flip</div>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-zinc-800 border border-zinc-600 rounded-2xl shadow-xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-xs text-blue-400 uppercase tracking-wider mb-4 font-medium">Answer</div>
          <p className="text-lg text-zinc-200 text-center leading-relaxed">{back}</p>
        </div>
      </div>
    </div>
  );
}
