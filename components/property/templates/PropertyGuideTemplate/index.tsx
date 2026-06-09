import { AppHeader } from '@/components/shared/organisms/AppHeader';
import { PropertyHero } from '@/components/property/organisms/PropertyHero';
import { AmenitiesSection } from '@/components/property/organisms/AmenitiesSection';
import { AccessSection } from '@/components/property/organisms/AccessSection';
import { StayRulesSection } from '@/components/property/organisms/StayRulesSection';
import { HostSection } from '@/components/property/organisms/HostSection';
import { Divider } from '@/components/shared/atoms/Divider';
import type { AmenityKey } from '@/components/property/atoms/AmenityIcon';

type AccessType = 'smart_lock' | 'key_safe' | 'physical_key' | 'other';

interface PropertyGuideTemplateProps {
  code: string;
  name: string;
  propertyType: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  images: Array<{ url: string; alt: string; order: number }>;
  amenities: Partial<Record<AmenityKey, boolean>>;
  wifi: { network: string; password: string };
  access: { type: AccessType; instructions: string; password?: string };
  parking?: { identifier?: string; instructions?: string } | null;
  rules: {
    checkInTime: string;
    checkOutTime: string;
    allowPet: boolean;
    smokingPermitted: boolean;
    suitableForChildren: boolean;
    suitableForBabies: boolean;
    eventsPermitted: boolean;
  };
  host: { name: string; phone: string };
  address?: {
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export function PropertyGuideTemplate({
  code,
  name,
  propertyType,
  city,
  state,
  bedrooms,
  bathrooms,
  maxGuests,
  images,
  amenities,
  wifi,
  access,
  parking,
  rules,
  host,
  address,
}: PropertyGuideTemplateProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader propertyCode={code} />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-8">
        <PropertyHero
          name={name}
          propertyType={propertyType}
          city={city}
          state={state}
          bedrooms={bedrooms}
          bathrooms={bathrooms}
          maxGuests={maxGuests}
          images={images}
        />

        <Divider />

        <AmenitiesSection amenities={amenities} />

        <Divider />

        <AccessSection wifi={wifi} access={access} parking={parking} />

        <Divider />

        <StayRulesSection
          checkInTime={rules.checkInTime}
          checkOutTime={rules.checkOutTime}
          allowPet={rules.allowPet}
          smokingPermitted={rules.smokingPermitted}
          suitableForChildren={rules.suitableForChildren}
          suitableForBabies={rules.suitableForBabies}
          eventsPermitted={rules.eventsPermitted}
        />

        <Divider />

        <HostSection host={host} address={address} />
      </main>

      <footer className="w-full border-t border-border bg-surface mt-8">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col items-center gap-2 text-center">
          <span className="text-base font-bold text-primary">seazone</span>
          <p className="text-xs text-text-muted">
            Gestão inteligente de imóveis por temporada
          </p>
          <p className="text-xs text-text-subtle">
            © {new Date().getFullYear()} Seazone Serviços Ltda.
          </p>
        </div>
      </footer>
    </div>
  );
}
