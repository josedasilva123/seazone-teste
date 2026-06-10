import { MdChecklist } from 'react-icons/md';
import { SectionTitle } from '@/components/shared/molecules/SectionTitle';
import { AmenityBadge } from '@/components/property/molecules/AmenityBadge';
import type { AmenityKey } from '@/components/property/atoms/AmenityIcon';

interface AmenitiesSectionProps {
  amenities: Partial<Record<AmenityKey, boolean>>;
}

const AMENITY_ORDER: AmenityKey[] = [
  'wifi',
  'airConditioning',
  'pool',
  'kitchen',
  'tv',
  'washingMachine',
  'balcony',
  'bbqGrill',
  'jacuzzi',
  'dishwasher',
  'elevator',
];

export function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  const available = AMENITY_ORDER.filter((key) => amenities[key] === true);

  if (available.length === 0) {
    return null;
  }

  return (
    <section aria-label="Amenidades">
      <SectionTitle
        icon={<MdChecklist size={22} aria-hidden />}
        title="Amenidades"
        subtitle="O que este imóvel oferece"
        className="mb-4"
      />
      <div className="flex flex-wrap gap-2">
        {available.map((key) => (
          <AmenityBadge key={key} amenity={key} />
        ))}
      </div>
    </section>
  );
}
