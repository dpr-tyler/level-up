import { DiagramNode as NodeType } from '@/types/lesson';

interface ArrowProps {
  from: NodeType;
  to: NodeType;
  label?: string;
  style?: 'solid' | 'dashed';
}

export function Arrow({ from, to, label, style = 'solid' }: ArrowProps) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx);

  // Offset start/end from node centers
  const startX = from.x + Math.cos(angle) * 60;
  const startY = from.y + Math.sin(angle) * 30;
  const endX = to.x - Math.cos(angle) * 60;
  const endY = to.y - Math.sin(angle) * 30;

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  return (
    <g>
      <defs>
        <marker
          id={`arrow-${from.id}-${to.id}`}
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L8,3 L0,6" fill="#52525b" />
        </marker>
      </defs>
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="#52525b"
        strokeWidth={1.5}
        strokeDasharray={style === 'dashed' ? '6,4' : undefined}
        markerEnd={`url(#arrow-${from.id}-${to.id})`}
        className="transition-all duration-500"
      />
      {label && (
        <text
          x={midX}
          y={midY - 8}
          textAnchor="middle"
          fontSize={10}
          fill="#71717a"
          className="select-none"
        >
          {label}
        </text>
      )}
    </g>
  );
}
