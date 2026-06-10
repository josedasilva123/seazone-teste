import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm active:scale-[0.98]',
  secondary:
    'bg-surface text-primary border border-primary hover:bg-primary-light active:scale-[0.98]',
  ghost:
    'bg-transparent text-text-body hover:bg-surface-secondary active:scale-[0.98]',
  danger:
    'bg-danger text-white hover:bg-red-700 shadow-sm active:scale-[0.98]',
  whatsapp:
    'bg-whatsapp text-white hover:bg-whatsapp-hover shadow-sm active:scale-[0.98]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-6 py-3 gap-2.5',
};

function getButtonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}: CommonProps) {
  return [
    'inline-flex items-center justify-center font-medium rounded-[--radius-md] transition-all duration-150 cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = getButtonClasses({ variant, size, fullWidth, className, children });

  if ('href' in props && props.href) {
    const { href, ...anchorProps } = props;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { disabled, ...buttonProps } = props as ButtonAsButton;

  return (
    <button className={classes} disabled={disabled} {...buttonProps}>
      {children}
    </button>
  );
}
