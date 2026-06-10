import { AppHeader } from '@/components/shared/organisms/AppHeader';
import { PropertyHero } from '@/components/property/organisms/PropertyHero';
import { AmenitiesSection } from '@/components/property/organisms/AmenitiesSection';
import { AccessSection } from '@/components/property/organisms/AccessSection';
import { StayRulesSection } from '@/components/property/organisms/StayRulesSection';
import { HostSection } from '@/components/property/organisms/HostSection';
import { ExperienceGuideSection } from '@/components/property/organisms/ExperienceGuideSection';
import { ChatAssistant } from '@/components/property/organisms/ChatAssistant';
import { Logo } from '@/components/shared/atoms';
import { CheckInOutStrip } from '@/components/property/molecules/CheckInOutStrip';
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

      {/* Hero — full-bleed, sem padding de container */}
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

      <CheckInOutStrip
        checkInTime={rules.checkInTime}
        checkOutTime={rules.checkOutTime}
      />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 space-y-10">
        <AmenitiesSection amenities={amenities} />

        <AccessSection wifi={wifi} access={access} parking={parking} />

        <StayRulesSection
          checkInTime={rules.checkInTime}
          checkOutTime={rules.checkOutTime}
          allowPet={rules.allowPet}
          smokingPermitted={rules.smokingPermitted}
          suitableForChildren={rules.suitableForChildren}
          suitableForBabies={rules.suitableForBabies}
          eventsPermitted={rules.eventsPermitted}
        />

        <HostSection host={host} address={address} />

        <ExperienceGuideSection code={code} />
      </main>

      <ChatAssistant code={code} />

      <footer className="w-full border-t border-border bg-surface mt-4">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-24 sm:pb-8 flex flex-col items-center gap-2 text-center">
          <Logo size="lg" />
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
