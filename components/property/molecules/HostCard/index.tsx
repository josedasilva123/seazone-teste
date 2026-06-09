import { MdPerson, MdPhone, MdLocationOn } from 'react-icons/md';

interface HostCardProps {
  name: string;
  phone: string;
  address?: {
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function HostCard({ name, phone, address }: HostCardProps) {
  const whatsappUrl = `https://wa.me/55${phone.replace(/\D/g, '')}`;

  return (
    <div className="bg-surface border border-border rounded-[--radius-lg] p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 bg-primary-light rounded-full text-primary font-bold text-lg">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xs text-text-muted mb-0.5">Seu anfitrião</p>
          <p className="font-semibold text-text-heading">{name}</p>
        </div>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors font-medium"
      >
        <MdPhone size={16} />
        {formatPhone(phone)}
      </a>

      {address && (
        <div className="flex items-start gap-2 text-sm text-text-muted">
          <MdLocationOn size={16} className="mt-0.5 shrink-0 text-text-subtle" />
          <address className="not-italic leading-relaxed">
            {address.street}, {address.number}
            {address.complement ? ` - ${address.complement}` : ''}
            {' · '}
            {address.neighborhood}
            {' · '}
            {address.city}/{address.state}
            {' · '}
            CEP {address.postalCode}
          </address>
        </div>
      )}
    </div>
  );
}
