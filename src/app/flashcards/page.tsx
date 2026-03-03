'use client';
import { decks } from '@/data/flashcards';
import { TOPICS } from '@/lib/constants';
import { useFlashcardProgress } from '@/hooks/useFlashcardProgress';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

function DeckCard({ topic }: { topic: string }) {
  const deck = decks[topic];
  const { getDueCount, getMasteredCount } = useFlashcardProgress(topic);
  if (!deck) return null;

  const dueCount = getDueCount(deck.cards.map(c => c.id));
  const masteredCount = getMasteredCount(deck.cards.map(c => c.id));

  return (
    <Link href={`/flashcards/${topic}`}>
      <Card hover padding="md" className="h-full">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{deck.icon}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-zinc-100 mb-1">{deck.title}</h3>
            <p className="text-sm text-zinc-500 mb-2">{deck.description}</p>
            <div className="flex gap-2">
              <Badge variant="info">{deck.cards.length} cards</Badge>
              {dueCount > 0 && <Badge variant="warning">{dueCount} due</Badge>}
              {masteredCount > 0 && <Badge variant="success">{masteredCount} mastered</Badge>}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function FlashcardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-zinc-100 mb-1">Flashcards</h1>
        <p className="text-zinc-500">Study with spaced repetition for long-term retention</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOPICS.map(topic => (
          <DeckCard key={topic.slug} topic={topic.slug} />
        ))}
      </div>
    </div>
  );
}
