'use client';
import { TOPICS } from '@/lib/constants';
import { lessons } from '@/data/lessons';
import { useProgress } from '@/hooks/useProgress';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function LessonsPage() {
  const { getLessonProgress } = useProgress();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-zinc-100 mb-1">Lessons</h1>
        <p className="text-zinc-500">Master system design fundamentals one topic at a time</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOPICS.map(topic => {
          const lesson = lessons[topic.slug];
          const progress = getLessonProgress(topic.slug);
          if (!lesson) return null;
          return (
            <Link key={topic.slug} href={`/lessons/${topic.slug}`}>
              <Card hover padding="md" className="h-full">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{topic.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-zinc-100">{lesson.title}</h3>
                      {progress?.completed && <Badge variant="success">Done</Badge>}
                    </div>
                    <p className="text-sm text-zinc-500 mb-2">{lesson.description}</p>
                    <span className="text-xs text-zinc-600">{lesson.estimatedMinutes} min</span>
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
