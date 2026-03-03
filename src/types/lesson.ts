export interface DiagramNode {
  id: string;
  type: 'server' | 'database' | 'cache' | 'loadBalancer' | 'queue' | 'cdn' | 'client' | 'dns' | 'firewall' | 'storage';
  label: string;
  x: number;
  y: number;
}

export interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed';
}

export interface DiagramDefinition {
  nodes: DiagramNode[];
  connections: DiagramConnection[];
}

export type ContentBlock =
  | { type: 'heading'; content: string; level?: 2 | 3 }
  | { type: 'paragraph'; content: string }
  | { type: 'code'; language: string; content: string }
  | { type: 'diagram'; diagram: DiagramDefinition; caption?: string }
  | { type: 'callout'; variant: 'info' | 'warning' | 'tip'; content: string }
  | { type: 'quiz'; question: QuizQuestion }
  | { type: 'list'; items: string[]; ordered?: boolean };

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  slug: string;
  title: string;
  description: string;
  icon: string;
  estimatedMinutes: number;
  content: ContentBlock[];
}
