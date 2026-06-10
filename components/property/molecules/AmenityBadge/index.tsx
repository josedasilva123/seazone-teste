import { AmenityIcon, amenityLabelMap, type AmenityKey } from '@/components/property/atoms/AmenityIcon';
import { Badge } from '@/components/shared/atoms';

interface AmenityBadgeProps {
  amenity: AmenityKey;
  className?: string;
}

export function AmenityBadge({ amenity, className = '' }: AmenityBadgeProps) {
  return (
    <Badge
      variant="tag"
      icon={<AmenityIcon amenity={amenity} size={16} />}
      className={className}
    >
      {amenityLabelMap[amenity]}
    </Badge>
  );
}
