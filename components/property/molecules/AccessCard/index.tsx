import { MdLock, MdKey, MdSmartphone, MdDirectionsCar } from 'react-icons/md';

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

const accessTypeConfig: Record<AccessType, { label: string; icon: React.ReactNode }> = {
  smart_lock: { label: 'Smart Lock', icon: <MdSmartphone size={20} /> },
  key_safe: { label: 'Cofre de Chaves', icon: <MdLock size={20} /> },
  physical_key: { label: 'Chave Física', icon: <MdKey size={20} /> },
  other: { label: 'Acesso ao Imóvel', icon: <MdKey size={20} /> },
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
      <div className="bg-surface border border-border rounded-[--radius-lg] p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-9 h-9 bg-accent-light rounded-[--radius-md] text-accent">
            {config.icon}
          </div>
          <span className="text-sm font-semibold text-text-heading">{config.label}</span>
        </div>

        <p className="text-sm text-text-body leading-relaxed">{instructions}</p>

        {password && (
          <div className="mt-3 bg-surface-secondary rounded-[--radius-md] px-3 py-2">
            <p className="text-xs text-text-muted mb-0.5">Código / Senha</p>
            <p className="text-sm font-mono font-semibold text-text-heading tracking-widest">
              {password}
            </p>
          </div>
        )}
      </div>

      {parking && (
        <div className="bg-surface border border-border rounded-[--radius-lg] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-9 h-9 bg-surface-secondary rounded-[--radius-md] text-text-muted">
              <MdDirectionsCar size={20} />
            </div>
            <span className="text-sm font-semibold text-text-heading">Estacionamento</span>
          </div>

          {parking.identifier && (
            <p className="text-sm text-text-body mb-1">
              <span className="font-medium">Vaga: </span>
              {parking.identifier}
            </p>
          )}
          {parking.instructions && (
            <p className="text-sm text-text-body leading-relaxed">{parking.instructions}</p>
          )}
        </div>
      )}
    </div>
  );
}

export { getAccessType };
