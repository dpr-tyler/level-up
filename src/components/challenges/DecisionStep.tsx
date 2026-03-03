'use client';
import { ChallengeStep, ChallengeOption } from '@/types/challenge';

interface DecisionStepProps {
  step: ChallengeStep;
  selectedOptionId: string | null;
  onSelect: (option: ChallengeOption) => void;
  disabled?: boolean;
}

export function DecisionStep({ step, selectedOptionId, onSelect, disabled }: DecisionStepProps) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <span className="text-xs text-blue-400 uppercase tracking-wider font-semibold">{step.category}</span>
        <h3 className="text-lg font-bold text-zinc-100 mt-1">{step.title}</h3>
        <p className="text-sm text-zinc-400 mt-1">{step.description}</p>
      </div>
      <div className="grid gap-3">
        {step.options.map(option => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => !disabled && onSelect(option)}
              disabled={disabled}
              className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500/30'
                  : disabled
                    ? 'border-zinc-800 opacity-50 cursor-not-allowed'
                    : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/30 cursor-pointer'
              }`}
            >
              <div className="font-medium text-zinc-100 text-sm">{option.label}</div>
              <div className="text-xs text-zinc-500 mt-1">{option.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
