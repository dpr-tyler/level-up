import { notFound } from 'next/navigation';
import { lessons } from '@/data/lessons';
import { LessonPageClient } from './LessonPageClient';

export function generateStaticParams() {
  return Object.keys(lessons).map((slug) => ({ slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = lessons[slug];

  if (!lesson) {
    notFound();
  }

  return <LessonPageClient slug={slug} lesson={lesson} />;
}
