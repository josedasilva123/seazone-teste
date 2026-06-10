import { SectionTitle } from '@/components/shared/molecules/SectionTitle';
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

      {/* Check-in / Check-out — cartões grandes */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-surface border border-border rounded-[--radius-lg] p-4 shadow-sm text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2">
            Check-in
          </p>
          <p className="text-lg font-bold text-text-heading leading-tight">
            A partir das {checkInTime}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-[--radius-lg] p-4 shadow-sm text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2">
            Check-out
          </p>
          <p className="text-lg font-bold text-text-heading leading-tight">
            Até as {checkOutTime}
          </p>
        </div>
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
