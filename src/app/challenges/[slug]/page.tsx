'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { challenges } from '@/data/challenges';
import { ArchitectureBuilder } from '@/components/challenges/ArchitectureBuilder';
import { Button } from '@/components/ui/Button';

export default function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const challenge = challenges[slug];

  if (!challenge) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Challenge not found</h1>
        <Button variant="secondary" onClick={() => router.push('/challenges')}>Back to Challenges</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => router.push('/challenges')} className="text-sm text-zinc-500 hover:text-zinc-300 mb-6 inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to Challenges
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{challenge.icon}</span>
        <div>
          <h1 className="text-2xl font-black text-zinc-100">{challenge.title}</h1>
          <p className="text-sm text-zinc-500">{challenge.description}</p>
        </div>
      </div>

      <ArchitectureBuilder challenge={challenge} onBack={() => router.push('/challenges')} />
    </div>
  );
}
