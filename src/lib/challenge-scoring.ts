import { Challenge, ChallengeStep } from '@/types/challenge';

export interface StepResult {
  stepId: string;
  optionId: string;
  score: number;
  maxScore: number;
}

export function scoreStep(step: ChallengeStep, selectedOptionId: string): StepResult {
  const option = step.options.find(o => o.id === selectedOptionId);
  const maxScore = Math.max(...step.options.map(o => o.score));
  return {
    stepId: step.id,
    optionId: selectedOptionId,
    score: option?.score ?? 0,
    maxScore,
  };
}

export function calculateTotalScore(results: StepResult[]): number {
  if (results.length === 0) return 0;
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const totalMax = results.reduce((sum, r) => sum + r.maxScore, 0);
  return totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
}

export function getCategoryScores(results: StepResult[], steps: ChallengeStep[]): Record<string, number> {
  const categories: Record<string, { score: number; max: number }> = {};
  for (const result of results) {
    const step = steps.find(s => s.id === result.stepId);
    if (!step) continue;
    if (!categories[step.category]) {
      categories[step.category] = { score: 0, max: 0 };
    }
    categories[step.category].score += result.score;
    categories[step.category].max += result.maxScore;
  }
  const out: Record<string, number> = {};
  for (const [cat, val] of Object.entries(categories)) {
    out[cat] = val.max > 0 ? Math.round((val.score / val.max) * 100) : 0;
  }
  return out;
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Great';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Improvement';
  return 'Keep Practicing';
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-400';
  if (score >= 75) return 'text-blue-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}
