'use client';
import { ChallengeOption } from '@/types/challenge';

interface FeedbackPanelProps {
  option: ChallengeOption;
  maxScore: number;
}

export function FeedbackPanel({ option, maxScore }: FeedbackPanelProps) {
  const pct = Math.round((option.score / maxScore) * 100);
  const color = pct >= 80 ? 'emerald' : pct >= 50 ? 'yellow' : 'red';
  const colors = {
    emerald: { bg: 'bg-emerald-950/30', border: 'border-emerald-800', text: 'text-emerald-400', bar: 'bg-emerald-500' },
    yellow: { bg: 'bg-yellow-950/30', border: 'border-yellow-800', text: 'text-yellow-400', bar: 'bg-yellow-500' },
    red: { bg: 'bg-red-950/30', border: 'border-red-800', text: 'text-red-400', bar: 'bg-red-500' },
  };
  const c = colors[color];

  return (
    <div className={`p-4 rounded-xl border ${c.bg} ${c.border} mb-6`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold ${c.text}`}>
          {pct >= 80 ? 'Excellent choice!' : pct >= 50 ? 'Decent choice' : 'Could be better'}
        </span>
        <span className={`text-sm font-bold ${c.text}`}>{option.score}/{maxScore}</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-3">
        <div className={`${c.bar} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-sm text-zinc-400">{option.feedback}</p>
    </div>
  );
}
