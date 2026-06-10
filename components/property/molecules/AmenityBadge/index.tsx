import { AmenityIcon, amenityLabelMap, type AmenityKey } from '@/components/property/atoms/AmenityIcon';
import { Badge } from '@/components/shared/atoms';

interface AmenityBadgeProps {
  amenity: AmenityKey;
  className?: string;
}

export function AmenityBadge({ amenity, className = '' }: AmenityBadgeProps) {
  return (
    <Badge
      icon={<AmenityIcon amenity={amenity} size={18} />}
      className={[
        'rounded-[--radius-md] shadow-sm px-3 py-2 text-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {amenityLabelMap[amenity]}
    </Badge>
  );
}
