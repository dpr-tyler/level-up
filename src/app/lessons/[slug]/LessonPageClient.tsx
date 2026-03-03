'use client';
import { useRouter } from 'next/navigation';
import { Lesson } from '@/types/lesson';
import { LessonContent } from '@/components/lessons/LessonContent';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useProgress } from '@/hooks/useProgress';

interface LessonPageClientProps {
  slug: string;
  lesson: Lesson;
}

export function LessonPageClient({ slug, lesson }: LessonPageClientProps) {
  const router = useRouter();
  const { markLessonComplete, updateQuizScore, getLessonProgress } = useProgress();
  const progress = getLessonProgress(slug);

  const handleQuizAnswer = (questionId: string, correct: boolean) => {
    updateQuizScore(slug, questionId, correct ? 1 : 0);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => router.push('/lessons')} className="text-sm text-zinc-500 hover:text-zinc-300 mb-6 inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to Lessons
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{lesson.icon}</span>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-zinc-100">{lesson.title}</h1>
            {progress?.completed && <Badge variant="success">Completed</Badge>}
          </div>
          <p className="text-sm text-zinc-500">{lesson.estimatedMinutes} min read</p>
        </div>
      </div>

      <LessonContent lesson={lesson} onQuizAnswer={handleQuizAnswer} />

      {!progress?.completed && (
        <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <Button size="lg" onClick={() => markLessonComplete(slug, lesson.title)}>
            Mark as Complete
          </Button>
        </div>
      )}
    </div>
  );
}
