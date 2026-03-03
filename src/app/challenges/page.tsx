'use client';
import { challengeList } from '@/data/challenges';
import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function ChallengesPage() {
  const { getBestScore, getAttemptCount } = useChallengeProgress();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-zinc-100 mb-1">Design Challenges</h1>
        <p className="text-zinc-500">Build system architectures step by step</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challengeList.map(challenge => {
          const best = getBestScore(challenge.slug);
          const attempts = getAttemptCount(challenge.slug);
          return (
            <Link key={challenge.slug} href={`/challenges/${challenge.slug}`}>
              <Card hover padding="md" className="h-full">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{challenge.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-zinc-100">{challenge.title}</h3>
                      <Badge variant={challenge.difficulty === 'advanced' ? 'purple' : 'info'}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-500 mb-2">{challenge.description}</p>
                    <div className="flex gap-2">
                      <span className="text-xs text-zinc-600">{challenge.steps.length} decisions</span>
                      {attempts > 0 && <Badge variant="success">Best: {best}%</Badge>}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
