'use client';
import { useState } from 'react';
import { QuizQuestion } from '@/types/lesson';
import { Button } from '@/components/ui/Button';

interface KnowledgeCheckProps {
  question: QuizQuestion;
  onAnswer?: (questionId: string, correct: boolean) => void;
}

export function KnowledgeCheck({ question, onAnswer }: KnowledgeCheckProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    onAnswer?.(question.id, selected === question.correctIndex);
  };

  const isCorrect = selected === question.correctIndex;

  return (
    <div className="my-6 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Knowledge Check</span>
      </div>
      <p className="text-zinc-100 font-medium mb-4">{question.question}</p>
      <div className="space-y-2 mb-4">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !submitted && setSelected(i)}
            disabled={submitted}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 text-sm ${
              submitted
                ? i === question.correctIndex
                  ? 'border-emerald-500 bg-emerald-950/50 text-emerald-300'
                  : i === selected
                    ? 'border-red-500 bg-red-950/50 text-red-300'
                    : 'border-zinc-800 text-zinc-500'
                : selected === i
                  ? 'border-blue-500 bg-blue-950/30 text-blue-300'
                  : 'border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>
      {!submitted ? (
        <Button onClick={handleSubmit} disabled={selected === null} size="sm">
          Check Answer
        </Button>
      ) : (
        <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-emerald-950/30 border-emerald-800' : 'bg-red-950/30 border-red-800'}`}>
          <p className={`font-medium mb-1 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct!' : 'Not quite.'}
          </p>
          <p className="text-sm text-zinc-400">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
