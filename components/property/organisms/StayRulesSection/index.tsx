import { MdGavel } from 'react-icons/md';
import { Card, Divider } from '@/components/shared/atoms';
import { SectionTitle } from '@/components/shared/molecules/SectionTitle';
import { CheckInOutCard } from '@/components/property/molecules/CheckInOutCard';
import { RuleItem } from '@/components/property/molecules/RuleItem';
import type { PolicyKey } from '@/components/property/molecules/RuleItem';

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
  const policies: Array<{ policy: PolicyKey; allowed: boolean }> = [
    { policy: 'pet', allowed: allowPet },
    { policy: 'smoking', allowed: smokingPermitted },
    { policy: 'children', allowed: suitableForChildren },
    { policy: 'babies', allowed: suitableForBabies },
    { policy: 'events', allowed: eventsPermitted },
  ];

  return (
    <section aria-label="Regras da estadia">
      <SectionTitle
        icon={<MdGavel size={22} aria-hidden />}
        title="Regras da Estadia"
        subtitle="Para uma experiência agradável para todos"
        className="mb-4"
      />

      {/* Check-in / Check-out — cartões grandes */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <CheckInOutCard type="check-in" time={checkInTime} />
        <CheckInOutCard type="check-out" time={checkOutTime} />
      </div>

      <Card>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
          Políticas
        </p>
        <div>
          {policies.map(({ policy, allowed }, index) => (
            <div key={policy}>
              {index > 0 && <Divider />}
              <RuleItem policy={policy} allowed={allowed} />
            </div>
          ))}
        </div>
      </Card>    </section>
  );
}
