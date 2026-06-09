import Link from 'next/link';
import { MdPhone } from 'react-icons/md';

interface AppHeaderProps {
  propertyCode?: string;
}

export function AppHeader({ propertyCode }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b border-border shadow-sm">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Seazone - Página inicial">
          <span className="text-lg font-bold text-primary tracking-tight">seazone</span>
          {propertyCode && (
            <span className="hidden sm:inline text-xs text-text-muted font-mono bg-surface-secondary px-2 py-0.5 rounded-full">
              {propertyCode}
            </span>
          )}
        </Link>

        <a
          href="https://wa.me/5548988620024"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          aria-label="Atendimento via WhatsApp"
        >
          <MdPhone size={18} />
          <span className="hidden sm:inline">Atendimento</span>
        </a>
      </div>
    </header>
  );
}
