import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

type ButtonStyleProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
};

type CommonProps = ButtonStyleProps & {
  children?: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-action text-white font-semibold rounded-full hover:bg-primary-action-hover focus-visible:ring-primary-action active:scale-[0.98]',
  secondary:
    'bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary-hover focus-visible:ring-primary active:scale-[0.98]',
  ghost:
    'bg-transparent text-text-body rounded-[--radius-md] hover:bg-surface-secondary focus-visible:ring-primary active:scale-[0.98]',
  danger:
    'bg-danger text-white rounded-[--radius-md] hover:bg-red-700 shadow-sm focus-visible:ring-danger active:scale-[0.98]',
  whatsapp:
    'bg-whatsapp text-white rounded-[--radius-md] hover:bg-whatsapp-hover shadow-sm focus-visible:ring-whatsapp active:scale-[0.98]',
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
}: ButtonStyleProps) {
  return [
    'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
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
  const classes = getButtonClasses({ variant, size, fullWidth, className });

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
