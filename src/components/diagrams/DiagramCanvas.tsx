'use client';

import { DiagramDefinition } from '@/types/lesson';
import { DiagramNode } from './nodes';
import { Arrow } from './Arrow';

interface DiagramCanvasProps {
  diagram: DiagramDefinition;
  caption?: string;
  className?: string;
  animated?: boolean;
}

export function DiagramCanvas({ diagram, caption, className = '', animated = false }: DiagramCanvasProps) {
  const padding = 40;
  const minX = Math.min(...diagram.nodes.map(n => n.x)) - 80;
  const maxX = Math.max(...diagram.nodes.map(n => n.x)) + 80;
  const minY = Math.min(...diagram.nodes.map(n => n.y)) - 50;
  const maxY = Math.max(...diagram.nodes.map(n => n.y)) + 50;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  return (
    <div className={`my-6 ${className}`}>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
        <svg
          viewBox={`${minX - padding} ${minY - padding} ${width} ${height}`}
          className="w-full"
          style={{ maxHeight: 400, minHeight: 200 }}
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#27272a" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x={minX - padding} y={minY - padding} width={width} height={height} fill="url(#grid)" />

          {/* Connections */}
          {diagram.connections.map((conn, i) => {
            const fromNode = diagram.nodes.find(n => n.id === conn.from);
            const toNode = diagram.nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            return (
              <Arrow
                key={i}
                from={fromNode}
                to={toNode}
                label={conn.label}
                style={conn.style}
              />
            );
          })}

          {/* Nodes */}
          {diagram.nodes.map((node, i) => (
            <g
              key={node.id}
              style={
                animated
                  ? { opacity: 0, animation: `fadeIn 0.4s ease-out ${i * 0.15}s forwards` }
                  : undefined
              }
            >
              <DiagramNode
                type={node.type}
                x={node.x}
                y={node.y}
                label={node.label}
              />
            </g>
          ))}
        </svg>
      </div>
      {caption && (
        <p className="text-xs text-zinc-500 text-center mt-2 italic">{caption}</p>
      )}
    </div>
  );
}
