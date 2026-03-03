'use client';
import { Card } from '@/components/ui/Card';
import { useProgress } from '@/hooks/useProgress';
import Link from 'next/link';

export function RecentActivity() {
  const { progress } = useProgress();
  const activities = progress.recentActivity.slice(0, 8);

  const getLink = (type: string, slug: string) => {
    switch (type) {
      case 'lesson': return `/lessons/${slug}`;
      case 'flashcard': return `/flashcards/${slug}`;
      case 'challenge': return `/challenges/${slug}`;
      default: return '/';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '📖';
      case 'flashcard': return '🃏';
      case 'challenge': return '💡';
      default: return '📌';
    }
  };

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (activities.length === 0) {
    return (
      <Card padding="md">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Recent Activity</h3>
        <p className="text-zinc-600 text-sm">No activity yet. Start a lesson to begin!</p>
      </Card>
    );
  }

  return (
    <Card padding="md">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((a, i) => (
          <Link
            key={i}
            href={getLink(a.type, a.slug)}
            className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-lg">{getIcon(a.type)}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-zinc-200 truncate">{a.title}</div>
              {a.detail && <div className="text-xs text-zinc-500">{a.detail}</div>}
            </div>
            <span className="text-xs text-zinc-600 flex-shrink-0">{timeAgo(a.timestamp)}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
