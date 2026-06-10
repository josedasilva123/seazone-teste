import Link from 'next/link';

interface PropertyCardProps {
  code: string;
  name: string;
  city: string;
  state: string;
  coverImage?: {
    url: string;
    alt?: string;
  };
  dailyRateFrom?: number;
  className?: string;
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

export function PropertyCard({
  code,
  name,
  city,
  state,
  coverImage,
  dailyRateFrom,
  className = '',
}: PropertyCardProps) {
  return (
    <Link
      href={`/${code}`}
      className={[
        'group block rounded-[--radius-xl] overflow-hidden bg-surface',
        'border border-border shadow-sm',
        'hover:shadow-md transition-shadow duration-200',
        className,
      ].join(' ')}
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] bg-surface-secondary overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage.url}
            alt={coverImage.alt ?? `${name} — ${city}/${state}`}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-subtle text-sm">
            Sem foto
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3 py-3">
        <p className="text-sm font-semibold text-text-heading leading-snug line-clamp-1">
          {name} — {state}
        </p>
        {dailyRateFrom !== undefined ? (
          <p className="text-sm text-text-muted mt-0.5">
            Diárias a partir de{' '}
            <span className="font-medium text-text-body">{formatCurrency(dailyRateFrom)}</span>
          </p>
        ) : (
          <p className="text-sm text-text-muted mt-0.5">Consulte disponibilidade</p>
        )}
      </div>
    </Link>
  );
}
