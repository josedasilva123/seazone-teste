import { AppHeader } from '@/components/shared/organisms/AppHeader';
import { PropertyList } from '@/components/property/organisms/PropertyList';
import { listProperties } from '@/lib/actions/property';

const PAGE_SIZE = 12;

export default async function HomePage() {
  const result = await listProperties({ pageSize: String(PAGE_SIZE), page: '1' });

  const initialData = result.ok
    ? result.data
    : { items: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-heading tracking-tight">
            Guia Digital do Hóspede
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Encontre seu imóvel e acesse todas as informações da estadia.
          </p>
        </div>

        {!result.ok && (
          <div className="rounded-[--radius-lg] bg-danger-light border border-danger/20 px-4 py-3 mb-6">
            <p className="text-sm text-danger">
              Não foi possível carregar os imóveis. Tente recarregar a página.
            </p>
          </div>
        )}

        <PropertyList
          initialItems={initialData.items}
          initialPage={initialData.page}
          initialTotalPages={initialData.totalPages}
          initialTotal={initialData.total}
        />
      </main>

      <footer className="w-full border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-sm font-bold text-primary">seazone</span>
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Seazone Serviços Ltda. — Gestão inteligente de imóveis por temporada
          </p>
        </div>
      </footer>
    </div>
  );
}
