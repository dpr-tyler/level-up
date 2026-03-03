interface NodeProps {
  x: number;
  y: number;
  label: string;
}

const nodeColors: Record<string, { bg: string; border: string; icon: string }> = {
  server: { bg: '#1e3a5f', border: '#3b82f6', icon: '\u{1F5A5}' },
  database: { bg: '#1e3f2e', border: '#22c55e', icon: '\u{1F5C4}' },
  cache: { bg: '#3f1e3f', border: '#a855f7', icon: '\u{1F4BE}' },
  loadBalancer: { bg: '#1e3a5f', border: '#06b6d4', icon: '\u2696' },
  queue: { bg: '#3f2e1e', border: '#f59e0b', icon: '\u{1F4E8}' },
  cdn: { bg: '#1e3a3f', border: '#14b8a6', icon: '\u{1F310}' },
  client: { bg: '#2d2d3f', border: '#818cf8', icon: '\u{1F464}' },
  dns: { bg: '#1e2f3f', border: '#38bdf8', icon: '\u{1F4E1}' },
  firewall: { bg: '#3f1e1e', border: '#ef4444', icon: '\u{1F512}' },
  storage: { bg: '#2f2f1e', border: '#eab308', icon: '\u{1F4BF}' },
};

export function DiagramNode({ type, x, y, label }: NodeProps & { type: string }) {
  const colors = nodeColors[type] || nodeColors.server;
  const width = 120;
  const height = 60;

  return (
    <g transform={`translate(${x - width / 2}, ${y - height / 2})`} className="diagram-node">
      <rect
        width={width}
        height={height}
        rx={8}
        fill={colors.bg}
        stroke={colors.border}
        strokeWidth={1.5}
        className="transition-all duration-300"
      />
      <text x={width / 2} y={22} textAnchor="middle" fontSize={16} className="select-none">
        {colors.icon}
      </text>
      <text
        x={width / 2}
        y={44}
        textAnchor="middle"
        fontSize={11}
        fill="#e4e4e7"
        fontWeight={500}
        className="select-none"
      >
        {label}
      </text>
    </g>
  );
}
