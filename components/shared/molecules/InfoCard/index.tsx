import type { ReactNode } from 'react';
import { Card } from '@/components/shared/atoms/Card';

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subvalue?: string;
  variant?: 'default' | 'highlight';
  align?: 'left' | 'center';
  className?: string;
}

export function InfoCard({
  icon,
  label,
  value,
  subvalue,
  variant = 'default',
  align = 'left',
  className = '',
}: InfoCardProps) {
  const isHighlight = variant === 'highlight';
  const isCenter = align === 'center';

  return (
    <Card
      variant={isHighlight ? 'highlight' : 'default'}
      className={[
        'flex flex-col gap-2',
        isCenter ? 'items-center text-center' : '',
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
            'font-semibold leading-tight',
            isCenter ? 'text-lg' : 'text-base',
            isHighlight ? 'text-primary' : 'text-text-heading',
          ].join(' ')}
        >
          {value}
        </p>
        {subvalue && (
          <p className="text-sm text-text-muted mt-0.5">{subvalue}</p>
        )}
      </div>
    </Card>
  );
}
