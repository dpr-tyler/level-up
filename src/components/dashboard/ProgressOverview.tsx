'use client';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TOPICS } from '@/lib/constants';
import { useProgress } from '@/hooks/useProgress';

export function ProgressOverview() {
  const { progress, getCompletedLessonCount } = useProgress();
  const completedLessons = getCompletedLessonCount();
  const totalLessons = TOPICS.length;

  const totalFlashcardsReviewed = Object.values(progress.flashcards).reduce((sum, fp) => sum + fp.totalReviewed, 0);
  const totalChallengeAttempts = Object.values(progress.challenges).reduce((sum, cp) => sum + cp.attempts.length, 0);
  const bestChallengeScore = Math.max(0, ...Object.values(progress.challenges).map(cp => cp.bestScore));

  const stats = [
    { label: 'Lessons Complete', value: `${completedLessons}/${totalLessons}`, progress: (completedLessons / totalLessons) * 100, color: 'blue' as const },
    { label: 'Cards Reviewed', value: totalFlashcardsReviewed.toString(), progress: Math.min(100, totalFlashcardsReviewed), color: 'purple' as const },
    { label: 'Challenges Done', value: totalChallengeAttempts.toString(), progress: Math.min(100, totalChallengeAttempts * 20), color: 'emerald' as const },
    { label: 'Best Score', value: bestChallengeScore > 0 ? `${bestChallengeScore}%` : '—', progress: bestChallengeScore, color: 'yellow' as const },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(s => (
        <Card key={s.label} padding="md">
          <div className="text-2xl font-black text-zinc-100 mb-1">{s.value}</div>
          <div className="text-xs text-zinc-500 mb-3">{s.label}</div>
          <ProgressBar value={s.progress} size="sm" color={s.color} />
        </Card>
      ))}
    </div>
  );
}
