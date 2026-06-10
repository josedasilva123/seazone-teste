import {
  MdPets,
  MdSmokingRooms,
  MdChildCare,
  MdCelebration,
  MdEscalatorWarning,
} from 'react-icons/md';
import { RuleStatus } from '@/components/property/atoms/RuleStatus';

export type PolicyKey = 'pet' | 'smoking' | 'children' | 'babies' | 'events';

interface RuleItemProps {
  policy: PolicyKey;
  allowed: boolean;
  className?: string;
}

const policyConfig: Record<PolicyKey, { label: (v: boolean) => string; icon: React.ReactNode }> = {
  pet: {
    label: (v) => (v ? 'Aceita animais de estimação' : 'Não aceita animais'),
    icon: <MdPets size={18} />,
  },
  smoking: {
    label: (v) => (v ? 'Permitido fumar' : 'Proibido fumar'),
    icon: <MdSmokingRooms size={18} />,
  },
  children: {
    label: (v) => (v ? 'Adequado para crianças' : 'Não adequado para crianças'),
    icon: <MdChildCare size={18} />,
  },
  babies: {
    label: (v) => (v ? 'Aceita bebês' : 'Não aceita bebês'),
    icon: <MdEscalatorWarning size={18} />,
  },
  events: {
    label: (v) => (v ? 'Eventos permitidos' : 'Eventos e festas proibidos'),
    icon: <MdCelebration size={18} />,
  },
};

export function RuleItem({ policy, allowed, className = '' }: RuleItemProps) {
  const config = policyConfig[policy];
  return (
    <div className={`flex items-center gap-3 py-2.5 ${className}`}>
      <span className="text-text-muted shrink-0">{config.icon}</span>
      <RuleStatus allowed={allowed} label={config.label(allowed)} />
    </div>
  );
}
