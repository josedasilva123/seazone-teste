import { MdLogin, MdLogout } from 'react-icons/md';
import { SectionTitle } from '@/components/shared/molecules/SectionTitle';
import { InfoCard } from '@/components/shared/molecules/InfoCard';
import { RuleItem } from '@/components/property/molecules/RuleItem';

interface StayRulesSectionProps {
  checkInTime: string;
  checkOutTime: string;
  allowPet: boolean;
  smokingPermitted: boolean;
  suitableForChildren: boolean;
  suitableForBabies: boolean;
  eventsPermitted: boolean;
}

export function StayRulesSection({
  checkInTime,
  checkOutTime,
  allowPet,
  smokingPermitted,
  suitableForChildren,
  suitableForBabies,
  eventsPermitted,
}: StayRulesSectionProps) {
  return (
    <section aria-label="Regras da estadia">
      <SectionTitle
        title="Regras da Estadia"
        subtitle="Para uma experiência agradável para todos"
        className="mb-4"
      />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <InfoCard
          icon={<MdLogin size={20} />}
          label="Check-in"
          value={`A partir das ${checkInTime}`}
          variant="highlight"
        />
        <InfoCard
          icon={<MdLogout size={20} />}
          label="Check-out"
          value={`Até as ${checkOutTime}`}
          variant="highlight"
        />
      </div>

      <div className="bg-surface border border-border rounded-[--radius-lg] p-4 shadow-sm">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
          Políticas
        </p>
        <div className="divide-y divide-border">
          <RuleItem policy="pet" allowed={allowPet} />
          <RuleItem policy="smoking" allowed={smokingPermitted} />
          <RuleItem policy="children" allowed={suitableForChildren} />
          <RuleItem policy="babies" allowed={suitableForBabies} />
          <RuleItem policy="events" allowed={eventsPermitted} />
        </div>
      </div>
    </section>
  );
}
