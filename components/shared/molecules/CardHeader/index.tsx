import type { ReactNode } from 'react';

type IconTone = 'primary' | 'accent' | 'neutral';

interface CardHeaderProps {
  icon: ReactNode;
  title: string;
  iconTone?: IconTone;
  className?: string;
}

const iconToneClasses: Record<IconTone, string> = {
  primary: 'bg-primary-light text-primary',
  accent: 'bg-accent-light text-accent',
  neutral: 'bg-surface-secondary text-text-muted',
};

export function CardHeader({
  icon,
  title,
  iconTone = 'primary',
  className = '',
}: CardHeaderProps) {
  return (
    <div className={['flex items-center gap-2 mb-3', className].filter(Boolean).join(' ')}>
      <div
        className={[
          'flex items-center justify-center w-9 h-9 rounded-[--radius-md]',
          iconToneClasses[iconTone],
        ].join(' ')}
      >
        {icon}
      </div>
      <span className="text-sm font-semibold text-text-heading">{title}</span>
    </div>
  );
}
