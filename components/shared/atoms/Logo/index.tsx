type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const sizeClasses: Record<LogoSize, string> = {
  sm: 'h-4 w-auto',
  md: 'h-5 w-auto',
  lg: 'h-6 w-auto',
};

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const classes = [sizeClasses[size], className].filter(Boolean).join(' ');

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.svg" alt="Seazone" className={classes} />
  );
}
