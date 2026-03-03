'use client';
import { Card } from '@/components/ui/Card';
import { TOPICS } from '@/lib/constants';
import { useProgress } from '@/hooks/useProgress';

export function TopicProgressChart() {
  const { progress } = useProgress();

  return (
    <Card padding="md">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Topic Progress</h3>
      <div className="space-y-2">
        {TOPICS.map(topic => {
          const lessonDone = progress.lessons[topic.slug]?.completed ?? false;
          const flashcardCount = progress.flashcards[topic.slug]?.totalReviewed ?? 0;
          const hasFlashcards = flashcardCount > 0;

          return (
            <div key={topic.slug} className="flex items-center gap-3">
              <span className="text-base w-6 text-center">{topic.icon}</span>
              <span className="text-sm text-zinc-300 flex-1 truncate">{topic.title}</span>
              <div className="flex gap-1.5">
                <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center ${lessonDone ? 'bg-emerald-900 text-emerald-400' : 'bg-zinc-800 text-zinc-600'}`}>
                  L
                </span>
                <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center ${hasFlashcards ? 'bg-purple-900 text-purple-400' : 'bg-zinc-800 text-zinc-600'}`}>
                  F
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-4 pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="w-3 h-3 rounded bg-emerald-900" /> Lesson done
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="w-3 h-3 rounded bg-purple-900" /> Cards studied
        </div>
      </div>
    </Card>
  );
}
