import { MdLock, MdKey, MdSmartphone, MdDirectionsCar } from 'react-icons/md';
import { Card } from '@/components/shared/atoms';
import { CardHeader, DataField } from '@/components/shared/molecules';

type AccessType = 'smart_lock' | 'key_safe' | 'physical_key' | 'other';

interface AccessCardProps {
  type: AccessType;
  instructions: string;
  password?: string;
  parking?: {
    identifier?: string;
    instructions?: string;
  } | null;
}

const accessTypeConfig: Record<AccessType, { label: string; icon: React.ReactNode; iconTone: 'primary' | 'accent' | 'neutral' }> = {
  smart_lock: { label: 'Smart Lock', icon: <MdSmartphone size={20} />, iconTone: 'accent' },
  key_safe: { label: 'Cofre de Chaves', icon: <MdLock size={20} />, iconTone: 'accent' },
  physical_key: { label: 'Chave Física', icon: <MdKey size={20} />, iconTone: 'accent' },
  other: { label: 'Acesso ao Imóvel', icon: <MdKey size={20} />, iconTone: 'accent' },
};

function getAccessType(raw: string): AccessType {
  const normalized = raw.toLowerCase().replace(/[^a-z_]/g, '');
  if (['smart_lock', 'key_safe', 'physical_key'].includes(normalized)) {
    return normalized as AccessType;
  }
  return 'other';
}

export function AccessCard({ type, instructions, password, parking }: AccessCardProps) {
  const config = accessTypeConfig[type] ?? accessTypeConfig.other;

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader icon={config.icon} title={config.label} iconTone={config.iconTone} />
        <p className="text-sm text-text-body leading-relaxed">{instructions}</p>
        {password && (
          <DataField label="Código / Senha" value={password} mono boxed className="mt-3" />
        )}
      </Card>

      {parking && (
        <Card>
          <CardHeader
            icon={<MdDirectionsCar size={20} />}
            title="Estacionamento"
            iconTone="neutral"
          />
          {parking.identifier && (
            <p className="text-sm text-text-body mb-1">
              <span className="font-medium">Vaga: </span>
              {parking.identifier}
            </p>
          )}
          {parking.instructions && (
            <p className="text-sm text-text-body leading-relaxed">{parking.instructions}</p>
          )}
        </Card>
      )}
    </div>
  );
}

export { getAccessType };
