import { MdLocationOn } from 'react-icons/md';
import { SectionTitle } from '@/components/shared/molecules/SectionTitle';
import { HostCard } from '@/components/property/molecules/HostCard';

interface HostSectionProps {
  host: {
    name: string;
    phone: string;
  };
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

export function HostSection({ host, address }: HostSectionProps) {
  return (
    <section aria-label="Contato e localização">
      <SectionTitle
        icon={<MdLocationOn size={22} aria-hidden />}
        title="Contato & Localização"
        subtitle="Precisa de ajuda? Fale com seu anfitrião."
        className="mb-4"
      />
      <HostCard name={host.name} phone={host.phone} address={address} />
    </section>
  );
}
