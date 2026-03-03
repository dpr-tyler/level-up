interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'purple';
  className?: string;
}

const variants = {
  default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  success: 'bg-emerald-950 text-emerald-400 border-emerald-800',
  warning: 'bg-yellow-950 text-yellow-400 border-yellow-800',
  info: 'bg-blue-950 text-blue-400 border-blue-800',
  purple: 'bg-purple-950 text-purple-400 border-purple-800',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
