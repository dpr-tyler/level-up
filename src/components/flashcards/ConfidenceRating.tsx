'use client';
import { Button } from '@/components/ui/Button';

interface ConfidenceRatingProps {
  onRate: (quality: number) => void;
}

const ratings = [
  { quality: 1, label: 'Again', color: 'text-red-400', description: 'Completely forgot' },
  { quality: 2, label: 'Hard', color: 'text-orange-400', description: 'Struggled to recall' },
  { quality: 3, label: 'Good', color: 'text-yellow-400', description: 'Recalled with effort' },
  { quality: 4, label: 'Easy', color: 'text-emerald-400', description: 'Recalled quickly' },
  { quality: 5, label: 'Perfect', color: 'text-blue-400', description: 'Instant recall' },
];

export function ConfidenceRating({ onRate }: ConfidenceRatingProps) {
  return (
    <div className="mt-6">
      <p className="text-sm text-zinc-500 text-center mb-3">How well did you know this?</p>
      <div className="flex gap-2 justify-center flex-wrap">
        {ratings.map(r => (
          <button
            key={r.quality}
            onClick={() => onRate(r.quality)}
            className={`flex flex-col items-center px-4 py-3 rounded-xl border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all duration-150 min-w-[80px]`}
          >
            <span className={`text-sm font-semibold ${r.color}`}>{r.label}</span>
            <span className="text-[10px] text-zinc-600 mt-0.5">{r.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
