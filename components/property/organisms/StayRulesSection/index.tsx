import { MdLogin, MdLogout } from 'react-icons/md';
import { Card, Divider } from '@/components/shared/atoms';
import { InfoCard } from '@/components/shared/molecules';import { SectionTitle } from '@/components/shared/molecules/SectionTitle';
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
        title="Regras da Estadia"
        subtitle="Para uma experiência agradável para todos"
        className="mb-4"
      />

      {/* Check-in / Check-out — cartões grandes */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <InfoCard
          icon={<MdLogin size={20} />}
          label="Check-in"
          value={`A partir das ${checkInTime}`}
          align="center"
        />
        <InfoCard
          icon={<MdLogout size={20} />}
          label="Check-out"
          value={`Até as ${checkOutTime}`}
          align="center"
        />
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
