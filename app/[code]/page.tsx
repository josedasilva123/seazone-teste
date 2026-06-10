import { notFound } from 'next/navigation';
import { getPropertyByCode } from '@/lib/actions/property';
import { createPropertyMetadata } from '@/lib/utils/metadata';
import { PropertyGuideTemplate } from '@/components/property/templates';
import { getAccessType } from '@/components/property/molecules/AccessCard';
import type { AmenityKey } from '@/components/property/atoms/AmenityIcon';

const AMENITY_KEYS: AmenityKey[] = [
  'wifi',
  'tv',
  'airConditioning',
  'kitchen',
  'washingMachine',
  'elevator',
  'balcony',
  'bbqGrill',
  'dishwasher',
  'jacuzzi',
  'pool',
];

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  const result = await getPropertyByCode(code.toUpperCase());

  if (!result.ok || !result.data) {
    return { title: 'Imóvel não encontrado — Seazone' };
  }

  const { name, address, images } = result.data;
  const coverImage = [...images].sort((a, b) => a.order - b.order)[0];

  return createPropertyMetadata({
    code,
    name,
    city: address?.city,
    state: address?.state,
    coverImageUrl: coverImage?.url,
    coverImageAlt: coverImage?.alt,
  });
}

export default async function PropertyGuidePage({ params }: PageProps) {
  const { code } = await params;
  const result = await getPropertyByCode(code.toUpperCase());

  if (!result.ok || !result.data) {
    notFound();
  }

  const p = result.data;

  if (!p.operational || !p.rules || !p.host) {
    notFound();
  }

  const amenities: Partial<Record<AmenityKey, boolean>> = {};
  if (p.amenities) {
    for (const key of AMENITY_KEYS) {
      if ((p.amenities as Record<string, unknown>)[key] === true) {
        amenities[key] = true;
      }
    }
  }

  const parking = p.operational.hasParkingSpot
    ? {
        identifier: p.operational.parkingSpotIdentifier ?? undefined,
        instructions: p.operational.parkingSpotInstructions ?? undefined,
      }
    : null;

  return (
    <PropertyGuideTemplate
      code={p.code}
      name={p.name}
      propertyType={p.propertyType}
      city={p.address?.city ?? ''}
      state={p.address?.state ?? ''}
      bedrooms={p.bedroomQuantity}
      bathrooms={p.bathroomQuantity}
      maxGuests={p.guestCapacity}
      images={p.images.map((img) => ({ url: img.url, alt: img.alt, order: img.order }))}
      amenities={amenities}
      wifi={{
        network: p.operational.wifiNetwork,
        password: p.operational.wifiPassword,
      }}
      access={{
        type: getAccessType(p.operational.propertyAccessType),
        instructions: p.operational.propertyAccessInstructions,
        password: p.operational.propertyPassword ?? undefined,
      }}
      parking={parking}
      rules={{
        checkInTime: p.rules.checkInTime,
        checkOutTime: p.rules.checkOutTime,
        allowPet: p.rules.allowPet,
        smokingPermitted: p.rules.smokingPermitted,
        suitableForChildren: p.rules.suitableForChildren,
        suitableForBabies: p.rules.suitableForBabies,
        eventsPermitted: p.rules.eventsPermitted,
      }}
      host={{
        name: p.host.name,
        phone: p.host.phone,
      }}
      address={
        p.address
          ? {
              street: p.address.street,
              number: p.address.number,
              complement: p.address.complement,
              neighborhood: p.address.neighborhood,
              city: p.address.city,
              state: p.address.state,
              postalCode: p.address.postalCode,
            }
          : undefined
      }
    />
  );
}
