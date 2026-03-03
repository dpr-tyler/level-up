'use client';
import { ProgressOverview } from '@/components/dashboard/ProgressOverview';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { TopicProgressChart } from '@/components/dashboard/TopicProgressChart';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

const quickActions = [
  { href: '/lessons', label: 'Start Learning', description: 'Work through structured lessons', icon: '📖', color: 'from-blue-600 to-blue-800' },
  { href: '/flashcards', label: 'Study Flashcards', description: 'Review with spaced repetition', icon: '🃏', color: 'from-purple-600 to-purple-800' },
  { href: '/challenges', label: 'Design Challenge', description: 'Build system architectures', icon: '💡', color: 'from-emerald-600 to-emerald-800' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-100 mb-1">Dashboard</h1>
        <p className="text-zinc-500">Track your system design mastery journey</p>
      </div>

      <ProgressOverview />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map(action => (
          <Link key={action.href} href={action.href}>
            <Card hover padding="md" className="h-full">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-lg mb-3`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-zinc-100 mb-1">{action.label}</h3>
              <p className="text-sm text-zinc-500">{action.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <TopicProgressChart />
      </div>
    </div>
  );
}
