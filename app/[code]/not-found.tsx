import Link from 'next/link';
import { AppHeader } from '@/components/shared/organisms/AppHeader';
import { Button, Logo } from '@/components/shared/atoms';

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="bg-surface border border-border rounded-[--radius-xl] shadow-md p-10 max-w-sm w-full">
          <p className="text-5xl font-bold text-primary mb-4">404</p>
          <h1 className="text-xl font-semibold text-text-heading mb-2">
            Imóvel não encontrado
          </h1>
          <p className="text-sm text-text-muted mb-8 leading-relaxed">
            O código do imóvel informado não existe ou o guia ainda não está disponível.
            Verifique o link recebido ou entre em contato com o anfitrião.
          </p>
          <Link href="/">
            <Button variant="primary" fullWidth>
              Ver todos os imóveis
            </Button>
          </Link>
        </div>
      </main>

      <footer className="w-full border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col items-center gap-1 text-center">
          <Logo size="sm" />
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Seazone Serviços Ltda.
          </p>
        </div>
      </footer>
    </div>
  );
}
