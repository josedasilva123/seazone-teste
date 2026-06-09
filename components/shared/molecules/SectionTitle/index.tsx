interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  align = 'left',
  className = '',
}: SectionTitleProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`flex flex-col gap-1 ${alignClass} ${className}`}>
      <h2 className="text-xl font-bold text-text-heading tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
    </div>
  );
}
