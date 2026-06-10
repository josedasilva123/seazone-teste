import Link from 'next/link';
import { MdWhatsapp } from 'react-icons/md';
import { Logo } from '@/components/shared/atoms';

interface AppHeaderProps {
  propertyCode?: string;
}

export function AppHeader({ propertyCode }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b border-border shadow-sm">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Seazone - Página inicial">
          <Logo size="md" />
          {propertyCode ? (
            <span className="text-xs text-text-muted font-mono bg-surface-secondary px-2 py-0.5 rounded-full border border-border">
              {propertyCode}
            </span>
          ) : (
            <span className="hidden sm:inline text-xs text-text-muted font-medium">
              Guia do Hóspede
            </span>
          )}
        </Link>

        <a
          href="https://wa.me/5548988620024"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-semibold text-primary border border-primary/40 bg-primary-light hover:bg-primary hover:text-white transition-colors px-3 py-1.5 rounded-full"
          aria-label="Atendimento via WhatsApp"
        >
          <MdWhatsapp size={17} />
          <span>Atendimento</span>
        </a>
      </div>
    </header>
  );
}
