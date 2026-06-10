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
      className={`group block ${className}`}
    >
      {/* Cover image — aspecto quadrado com cantos arredondados */}
      <div className="relative aspect-square rounded-[--radius-xl] overflow-hidden bg-surface-secondary">
        {coverImage ? (
          <img
            src={coverImage.url}
            alt={coverImage.alt ?? `${city} – ${state}`}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-text-subtle text-sm">Sem foto</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-3 px-0.5">
        <p className="text-sm font-semibold text-text-heading leading-snug line-clamp-1">
          {city} - {state}
        </p>
        {dailyRateFrom !== undefined ? (
          <p className="text-sm text-primary mt-0.5">
            Diárias a partir de {formatCurrency(dailyRateFrom)}
          </p>
        ) : (
          <p className="text-sm text-text-muted mt-0.5">Consulte disponibilidade</p>
        )}
      </div>
    </Link>
  );
}
