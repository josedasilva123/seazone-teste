import Link from 'next/link';
import { MdWhatsapp } from 'react-icons/md';
import { Button, Logo } from '@/components/shared/atoms';

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

        <Button
          href="https://wa.me/5548988620024"
          variant="primary"
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Atendimento via WhatsApp"
        >
          <MdWhatsapp size={17} />
          Atendimento
        </Button>
      </div>
    </header>
  );
}
