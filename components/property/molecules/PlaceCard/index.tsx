import type { ReactNode } from 'react';
import { MdLocationOn } from 'react-icons/md';
import { Card } from '@/components/shared/atoms';

interface PlaceCardProps {
  name: string;
  distance: string;
  description: string;
  icon?: ReactNode;
}

export function PlaceCard({ name, distance, description, icon }: PlaceCardProps) {
  return (
    <Card padding={false} className="p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {icon}
          <span className="text-sm font-medium text-text-heading">{name}</span>
        </div>
        <span className="text-xs text-text-muted flex items-center gap-0.5 shrink-0">
          <MdLocationOn size={12} />
          {distance}
        </span>
      </div>
      <p className={['text-xs text-text-muted mt-1 leading-relaxed', icon ? 'ml-6' : ''].filter(Boolean).join(' ')}>
        {description}
      </p>
    </Card>
  );
}
