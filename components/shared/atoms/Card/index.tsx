import type { ReactNode } from 'react';

type CardVariant = 'default' | 'highlight' | 'warning' | 'danger';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: boolean;
  className?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-surface border-border shadow-sm',
  highlight: 'bg-primary-light border-primary/20',
  warning: 'bg-warning-light border-warning/20',
  danger: 'bg-danger-light border-danger/20',
};

export function Card({
  children,
  variant = 'default',
  padding = true,
  className = '',
}: CardProps) {
  return (
    <div
      className={[
        'border rounded-[--radius-lg]',
        variantClasses[variant],
        padding ? 'p-4' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
