import type { ReactNode } from 'react';
import { Badge } from '@/components/shared/atoms';

interface CardHeaderProps {
  icon: ReactNode;
  title: string;
  /** @deprecated Mantido por compatibilidade; tags usam ícone coral. */
  iconTone?: 'primary' | 'accent' | 'neutral';
  className?: string;
}

export function CardHeader({
  icon,
  title,
  className = '',
}: CardHeaderProps) {
  return (
    <Badge
      variant="tag"
      icon={icon}
      className={['mb-3', className].filter(Boolean).join(' ')}
    >
      {title}
    </Badge>
  );
}
