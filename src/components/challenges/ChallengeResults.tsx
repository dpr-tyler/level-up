'use client';
import { Button } from '@/components/ui/Button';
import { getScoreLabel, getScoreColor } from '@/lib/challenge-scoring';

interface CategoryScore {
  category: string;
  score: number;
}

interface ChallengeResultsProps {
  totalScore: number;
  categoryScores: CategoryScore[];
  onRetry: () => void;
  onBack: () => void;
}

export function ChallengeResults({ totalScore, categoryScores, onRetry, onBack }: ChallengeResultsProps) {
  const label = getScoreLabel(totalScore);
  const color = getScoreColor(totalScore);

  return (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">{totalScore >= 75 ? '🏆' : totalScore >= 50 ? '👍' : '📚'}</div>
      <h2 className="text-3xl font-bold text-zinc-100 mb-2">{label}</h2>
      <p className={`text-5xl font-black mb-8 ${color}`}>{totalScore}%</p>

      <div className="max-w-md mx-auto mb-8">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Category Breakdown</h3>
        <div className="space-y-3">
          {categoryScores.map(cs => (
            <div key={cs.category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-300">{cs.category}</span>
                <span className={getScoreColor(cs.score)}>{cs.score}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    cs.score >= 80 ? 'bg-emerald-500' : cs.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${cs.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="secondary" onClick={onRetry}>Try Again</Button>
        <Button onClick={onBack}>Back to Challenges</Button>
      </div>
    </div>
  );
}
