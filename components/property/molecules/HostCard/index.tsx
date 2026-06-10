import { MdWhatsapp, MdLocationOn } from 'react-icons/md';

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
    <div className="bg-surface border border-border rounded-[--radius-lg] shadow-sm overflow-hidden">
      {/* Cabeçalho do anfitrião */}
      <div className="flex items-center gap-4 p-5 border-b border-border">
        <div className="flex items-center justify-center w-14 h-14 bg-primary-light rounded-full text-primary font-bold text-xl shrink-0">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted mb-0.5">Seu anfitrião</p>
          <p className="font-semibold text-text-heading text-base">{name}</p>
          <p className="text-sm text-text-muted">{formatPhone(phone)}</p>
        </div>
      </div>

      {/* CTA WhatsApp */}
      <div className="px-5 py-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm py-3 rounded-[--radius-md] transition-colors"
        >
          <MdWhatsapp size={20} />
          Falar com o anfitrião
        </a>
      </div>

      {/* Endereço */}
      {address && (
        <div className="flex items-start gap-2.5 px-5 pb-5 text-sm text-text-muted border-t border-border pt-4">
          <MdLocationOn size={16} className="mt-0.5 shrink-0 text-text-subtle" />
          <address className="not-italic leading-relaxed">
            {address.street}, {address.number}
            {address.complement ? ` — ${address.complement}` : ''}
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
