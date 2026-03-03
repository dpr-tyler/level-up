import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ hover = false, padding = 'md', className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-zinc-900 border border-zinc-800 rounded-xl ${paddings[padding]} ${
        hover ? 'hover:border-zinc-700 hover:bg-zinc-800/50 transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
