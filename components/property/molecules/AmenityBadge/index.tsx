import { AmenityIcon, amenityLabelMap, type AmenityKey } from '@/components/property/atoms/AmenityIcon';

interface AmenityBadgeProps {
  amenity: AmenityKey;
  className?: string;
}

export function AmenityBadge({ amenity, className = '' }: AmenityBadgeProps) {
  return (
    <div
      className={[
        'inline-flex items-center gap-2 px-3 py-2 rounded-[--radius-md]',
        'bg-surface border border-border text-text-body',
        'text-sm font-medium shadow-sm',
        className,
      ].join(' ')}
    >
      <span className="text-primary">
        <AmenityIcon amenity={amenity} size={18} />
      </span>
      {amenityLabelMap[amenity]}
    </div>
  );
}
