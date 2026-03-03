interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'emerald' | 'purple' | 'yellow';
  showLabel?: boolean;
  className?: string;
}

const colors = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  purple: 'bg-purple-500',
  yellow: 'bg-yellow-500',
};

const heights = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({ value, max = 100, size = 'md', color = 'blue', showLabel = false, className = '' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-xs text-zinc-400">
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full bg-zinc-800 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${colors[color]} ${heights[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
