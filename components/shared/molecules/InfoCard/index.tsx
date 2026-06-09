import type { ReactNode } from 'react';

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subvalue?: string;
  variant?: 'default' | 'highlight';
  className?: string;
}

export function InfoCard({
  icon,
  label,
  value,
  subvalue,
  variant = 'default',
  className = '',
}: InfoCardProps) {
  const isHighlight = variant === 'highlight';

  return (
    <div
      className={[
        'flex flex-col gap-2 p-4 rounded-[--radius-lg] border',
        isHighlight
          ? 'bg-primary-light border-primary/20'
          : 'bg-surface border-border shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'flex items-center justify-center w-10 h-10 rounded-[--radius-md] text-xl',
          isHighlight ? 'bg-primary/10 text-primary' : 'bg-surface-secondary text-text-muted',
        ].join(' ')}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p
          className={[
            'font-semibold text-base leading-tight',
            isHighlight ? 'text-primary' : 'text-text-heading',
          ].join(' ')}
        >
          {value}
        </p>
        {subvalue && (
          <p className="text-sm text-text-muted mt-0.5">{subvalue}</p>
        )}
      </div>
    </div>
  );
}
