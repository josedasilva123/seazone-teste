import type { ReactNode } from 'react';

interface DataFieldProps {
  label: string;
  value: ReactNode;
  mono?: boolean;
  boxed?: boolean;
  action?: ReactNode;
  className?: string;
}

export function DataField({
  label,
  value,
  mono = false,
  boxed = false,
  action,
  className = '',
}: DataFieldProps) {
  const valueClasses = mono
    ? 'text-sm font-mono font-medium text-text-heading tracking-wide'
    : 'text-sm font-medium text-text-body';

  if (boxed) {
    return (
      <div className={className}>
        <p className="text-xs text-text-muted mb-0.5">{label}</p>
        <div className="flex items-center justify-between gap-2 bg-surface-secondary rounded-[--radius-md] px-3 py-2">
          <span className={valueClasses}>{value}</span>
          {action}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="text-xs text-text-muted mb-0.5">{label}</p>
      <p
        className={[
          mono ? 'text-sm font-mono font-semibold text-text-heading tracking-widest' : valueClasses,
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  );
}
