import { DiagramNode, DiagramConnection } from './lesson';

export interface DiagramEffect {
  addNodes?: DiagramNode[];
  addConnections?: DiagramConnection[];
}

export interface ChallengeOption {
  id: string;
  label: string;
  description: string;
  score: number;
  feedback: string;
  diagramEffect: DiagramEffect;
}

export interface ChallengeStep {
  id: string;
  title: string;
  description: string;
  category: string;
  options: ChallengeOption[];
}

export interface ChallengeRequirements {
  scale: string;
  latency: string;
  availability: string;
  storage: string;
}

export interface Challenge {
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'intermediate' | 'advanced';
  requirements: ChallengeRequirements;
  steps: ChallengeStep[];
}
