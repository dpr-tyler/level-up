'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { decks } from '@/data/flashcards';
import { FlashcardDeck } from '@/components/flashcards/FlashcardDeck';
import { Button } from '@/components/ui/Button';

export default function FlashcardStudyPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = use(params);
  const router = useRouter();
  const deck = decks[topic];

  if (!deck) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Deck not found</h1>
        <Button variant="secondary" onClick={() => router.push('/flashcards')}>Back to Decks</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => router.push('/flashcards')} className="text-sm text-zinc-500 hover:text-zinc-300 mb-6 inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to Decks
      </button>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">{deck.icon}</span>
        <div>
          <h1 className="text-2xl font-black text-zinc-100">{deck.title}</h1>
          <p className="text-sm text-zinc-500">{deck.cards.length} cards</p>
        </div>
      </div>

      <FlashcardDeck
        topic={topic}
        cards={deck.cards}
        onComplete={() => router.push('/flashcards')}
      />
    </div>
  );
}
