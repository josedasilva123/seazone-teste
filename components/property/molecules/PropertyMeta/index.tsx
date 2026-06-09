import { MdBed, MdBathtub, MdPeople } from 'react-icons/md';

interface PropertyMetaProps {
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  className?: string;
}

function MetaItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-text-muted">
      <span className="text-primary">{icon}</span>
      <span className="text-sm font-medium text-text-body">
        {value}{' '}
        <span className="text-text-muted font-normal">{label}</span>
      </span>
    </div>
  );
}

export function PropertyMeta({
  bedrooms,
  bathrooms,
  maxGuests,
  className = '',
}: PropertyMetaProps) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}>
      <MetaItem icon={<MdBed size={18} />} value={bedrooms} label="quarto(s)" />
      <MetaItem icon={<MdBathtub size={18} />} value={bathrooms} label="banheiro(s)" />
      <MetaItem icon={<MdPeople size={18} />} value={maxGuests} label="hóspede(s)" />
    </div>
  );
}
