import { MdBed, MdBathtub, MdPeople } from 'react-icons/md';

type Tone = 'default' | 'inverse';
type Size = 'default' | 'sm';

interface PropertyMetaProps {
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  tone?: Tone;
  size?: Size;
  className?: string;
}

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

function MetaItem({
  icon,
  text,
  tone,
  size,
}: {
  icon: React.ReactNode;
  text: string;
  tone: Tone;
  size: Size;
}) {
  const isInverse = tone === 'inverse';
  const isSm = size === 'sm';

  return (
    <span
      className={[
        'flex items-center gap-1',
        isSm ? 'text-[11px]' : 'text-sm',
        isInverse ? 'text-white/65' : 'text-text-body',
      ].join(' ')}
    >
      <span className={isInverse ? 'text-white/65' : 'text-primary'}>{icon}</span>
      {text}
    </span>
  );
}

export function PropertyMeta({
  bedrooms,
  bathrooms,
  maxGuests,
  tone = 'default',
  size = 'default',
  className = '',
}: PropertyMetaProps) {
  const iconSize = size === 'sm' ? 12 : 18;

  return (
    <div
      className={[
        'flex flex-wrap items-center',
        size === 'sm' ? 'gap-x-3 gap-y-0' : 'gap-x-4 gap-y-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <MetaItem
        icon={<MdBed size={iconSize} />}
        text={`${bedrooms} ${pluralize(bedrooms, 'quarto', 'quartos')}`}
        tone={tone}
        size={size}
      />
      <MetaItem
        icon={<MdBathtub size={iconSize} />}
        text={`${bathrooms} ${pluralize(bathrooms, 'banheiro', 'banheiros')}`}
        tone={tone}
        size={size}
      />
      <MetaItem
        icon={<MdPeople size={iconSize} />}
        text={`até ${maxGuests} ${pluralize(maxGuests, 'hóspede', 'hóspedes')}`}
        tone={tone}
        size={size}
      />
    </div>
  );
}
