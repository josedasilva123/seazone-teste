import type { ReactNode } from 'react';

interface SectionTitleProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionTitle({
  icon,
  title,
  subtitle,
  align = 'left',
  className = '',
}: SectionTitleProps) {
  const isCenter = align === 'center';

  return (
    <div
      className={[
        'flex gap-3',
        isCenter ? 'flex-col items-center text-center' : 'items-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'flex items-center justify-center w-11 h-11 rounded-[--radius-md] shrink-0',
          'bg-primary-action-light text-primary-action',
        ].join(' ')}
        aria-hidden
      >
        {icon}
      </div>
      <div className={isCenter ? 'flex flex-col gap-0.5' : 'flex flex-col gap-0.5 min-w-0'}>
        <h2 className="text-lg font-bold text-primary-action tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-text-muted leading-snug">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
