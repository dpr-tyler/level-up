'use client';
import { ContentBlock, Lesson } from '@/types/lesson';
import { DiagramCanvas } from '@/components/diagrams/DiagramCanvas';
import { KnowledgeCheck } from './KnowledgeCheck';

interface LessonContentProps {
  lesson: Lesson;
  onQuizAnswer?: (questionId: string, correct: boolean) => void;
}

export function LessonContent({ lesson, onQuizAnswer }: LessonContentProps) {
  return (
    <div className="prose prose-invert max-w-none">
      {lesson.content.map((block, i) => (
        <ContentBlockRenderer key={i} block={block} onQuizAnswer={onQuizAnswer} />
      ))}
    </div>
  );
}

function ContentBlockRenderer({ block, onQuizAnswer }: { block: ContentBlock; onQuizAnswer?: (id: string, correct: boolean) => void }) {
  switch (block.type) {
    case 'heading':
      if (block.level === 3) return <h3 className="text-lg font-semibold text-zinc-100 mt-8 mb-3">{block.content}</h3>;
      return <h2 className="text-xl font-bold text-zinc-100 mt-10 mb-4">{block.content}</h2>;

    case 'paragraph':
      return <p className="text-zinc-400 leading-relaxed mb-4">{block.content}</p>;

    case 'code':
      return (
        <div className="my-4 rounded-lg overflow-hidden border border-zinc-800">
          <div className="bg-zinc-800/50 px-4 py-2 text-xs text-zinc-500 font-mono">{block.language}</div>
          <pre className="bg-zinc-900/50 p-4 overflow-x-auto">
            <code className="text-sm text-zinc-300 font-mono">{block.content}</code>
          </pre>
        </div>
      );

    case 'diagram':
      return <DiagramCanvas diagram={block.diagram} caption={block.caption} />;

    case 'callout': {
      const styles = {
        info: 'border-blue-800 bg-blue-950/30 text-blue-300',
        warning: 'border-yellow-800 bg-yellow-950/30 text-yellow-300',
        tip: 'border-emerald-800 bg-emerald-950/30 text-emerald-300',
      };
      const icons = { info: 'ℹ️', warning: '⚠️', tip: '💡' };
      return (
        <div className={`my-4 p-4 rounded-lg border ${styles[block.variant]}`}>
          <span className="mr-2">{icons[block.variant]}</span>
          {block.content}
        </div>
      );
    }

    case 'quiz':
      return <KnowledgeCheck question={block.question} onAnswer={onQuizAnswer} />;

    case 'list':
      if (block.ordered) {
        return (
          <ol className="list-decimal list-inside space-y-2 my-4 text-zinc-400">
            {block.items.map((item, i) => <li key={i}>{item}</li>)}
          </ol>
        );
      }
      return (
        <ul className="list-disc list-inside space-y-2 my-4 text-zinc-400">
          {block.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );

    default:
      return null;
  }
}
