'use client';
import { useState, useMemo } from 'react';
import { Challenge, ChallengeOption } from '@/types/challenge';
import { DiagramDefinition, DiagramNode, DiagramConnection } from '@/types/lesson';
import { DiagramCanvas } from '@/components/diagrams/DiagramCanvas';
import { DecisionStep } from './DecisionStep';
import { FeedbackPanel } from './FeedbackPanel';
import { ChallengeResults } from './ChallengeResults';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { scoreStep, calculateTotalScore, getCategoryScores, StepResult } from '@/lib/challenge-scoring';
import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { useProgress } from '@/hooks/useProgress';

interface ArchitectureBuilderProps {
  challenge: Challenge;
  onBack: () => void;
}

export function ArchitectureBuilder({ challenge, onBack }: ArchitectureBuilderProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, ChallengeOption>>({});
  const [results, setResults] = useState<StepResult[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [complete, setComplete] = useState(false);
  const { recordAttempt } = useChallengeProgress();
  const { addActivity } = useProgress();

  const currentStep = challenge.steps[currentStepIndex];

  // Build up diagram from all selections
  const diagram = useMemo<DiagramDefinition>(() => {
    const nodes: DiagramNode[] = [];
    const connections: DiagramConnection[] = [];
    const nodeIds = new Set<string>();

    for (const step of challenge.steps) {
      const sel = selections[step.id];
      if (!sel) break;
      if (sel.diagramEffect.addNodes) {
        for (const n of sel.diagramEffect.addNodes) {
          if (!nodeIds.has(n.id)) {
            nodes.push(n);
            nodeIds.add(n.id);
          }
        }
      }
      if (sel.diagramEffect.addConnections) {
        connections.push(...sel.diagramEffect.addConnections);
      }
    }
    return { nodes, connections };
  }, [selections, challenge.steps]);

  const handleSelect = (option: ChallengeOption) => {
    const step = currentStep;
    setSelections(prev => ({ ...prev, [step.id]: option }));
    const result = scoreStep(step, option.id);
    setResults(prev => [...prev, result]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentStepIndex + 1 >= challenge.steps.length) {
      const allResults = results;
      const totalScore = calculateTotalScore(allResults);
      recordAttempt({
        slug: challenge.slug,
        completedAt: Date.now(),
        totalScore,
        stepScores: Object.fromEntries(allResults.map(r => [r.stepId, r.score])),
        selectedOptions: Object.fromEntries(Object.entries(selections).map(([k, v]) => [k, v.id])),
      });
      addActivity({ type: 'challenge', slug: challenge.slug, title: challenge.title, detail: `Score: ${totalScore}%` });
      setComplete(true);
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    setCurrentStepIndex(0);
    setSelections({});
    setResults([]);
    setShowFeedback(false);
    setComplete(false);
  };

  const totalScore = calculateTotalScore(results);
  const categoryScores = getCategoryScores(results, challenge.steps);

  if (complete) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">{challenge.title} — Results</h2>
          {diagram.nodes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Your Architecture</h3>
              <DiagramCanvas diagram={diagram} animated />
            </div>
          )}
        </div>
        <ChallengeResults
          totalScore={totalScore}
          categoryScores={Object.entries(categoryScores).map(([category, score]) => ({ category, score }))}
          onRetry={handleRetry}
          onBack={onBack}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Requirements */}
      <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Requirements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><span className="text-zinc-500">Scale:</span> <span className="text-zinc-300">{challenge.requirements.scale}</span></div>
          <div><span className="text-zinc-500">Latency:</span> <span className="text-zinc-300">{challenge.requirements.latency}</span></div>
          <div><span className="text-zinc-500">Availability:</span> <span className="text-zinc-300">{challenge.requirements.availability}</span></div>
          <div><span className="text-zinc-500">Storage:</span> <span className="text-zinc-300">{challenge.requirements.storage}</span></div>
        </div>
      </div>

      {/* Live Diagram */}
      {diagram.nodes.length > 0 && (
        <DiagramCanvas diagram={diagram} caption="Your architecture so far" animated />
      )}

      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-zinc-500">Step {currentStepIndex + 1} of {challenge.steps.length}</span>
        <div className="flex-1 bg-zinc-800 rounded-full h-1.5">
          <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${((currentStepIndex + (showFeedback ? 1 : 0)) / challenge.steps.length) * 100}%` }} />
        </div>
      </div>

      {/* Current Decision */}
      <DecisionStep
        step={currentStep}
        selectedOptionId={selections[currentStep.id]?.id ?? null}
        onSelect={handleSelect}
        disabled={showFeedback}
      />

      {/* Feedback */}
      {showFeedback && selections[currentStep.id] && (
        <>
          <FeedbackPanel
            option={selections[currentStep.id]}
            maxScore={Math.max(...currentStep.options.map(o => o.score))}
          />
          <div className="flex justify-end">
            <Button onClick={handleNext}>
              {currentStepIndex + 1 >= challenge.steps.length ? 'See Results' : 'Next Step'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
