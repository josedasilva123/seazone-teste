import { MdVpnKey } from 'react-icons/md';
import { SectionTitle } from '@/components/shared/molecules/SectionTitle';
import { WifiCard } from '@/components/property/molecules/WifiCard';
import { AccessCard } from '@/components/property/molecules/AccessCard';

type AccessType = 'smart_lock' | 'key_safe' | 'physical_key' | 'other';

interface AccessSectionProps {
  wifi: {
    network: string;
    password: string;
  };
  access: {
    type: AccessType;
    instructions: string;
    password?: string;
  };
  parking?: {
    identifier?: string;
    instructions?: string;
  } | null;
}

export function AccessSection({ wifi, access, parking }: AccessSectionProps) {
  return (
    <section aria-label="Informações de acesso">
      <SectionTitle
        icon={<MdVpnKey size={22} aria-hidden />}
        title="Acesso ao Imóvel"
        subtitle="Tudo que você precisa para entrar e se conectar"
        className="mb-4"
      />
      <div className="space-y-3">
        <WifiCard network={wifi.network} password={wifi.password} />
        <AccessCard
          type={access.type}
          instructions={access.instructions}
          password={access.password}
          parking={parking}
        />
      </div>
    </section>
  );
}
