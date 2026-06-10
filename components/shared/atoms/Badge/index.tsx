import type { ReactNode } from 'react';

type Variant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'accent' | 'tag';
type Size = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-surface-secondary text-text-body border border-border',
  primary: 'bg-primary-light text-primary border border-primary/20',
  success: 'bg-success-light text-success border border-success/20',
  danger: 'bg-danger-light text-danger border border-danger/20',
  warning: 'bg-warning-light text-warning border border-warning/20',
  accent: 'bg-accent-light text-accent border border-accent/20',
  tag: 'bg-surface text-text-heading border border-border font-medium',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && (
        <span
          className={[
            'shrink-0',
            variant === 'tag' ? 'text-primary-action' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
