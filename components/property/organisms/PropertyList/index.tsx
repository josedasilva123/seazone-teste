'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { listProperties } from '@/lib/actions/property';
import type { PropertyListItem } from '@/lib/repositories/property';
import { PropertyCard } from '@/components/property/molecules/PropertyCard';
import { PropertyCardSkeletonGrid } from '@/components/property/atoms/PropertyCardSkeleton';

const PAGE_SIZE = 12;

interface PropertyListProps {
  initialItems: PropertyListItem[];
  initialPage: number;
  initialTotalPages: number;
  initialTotal: number;
}

export function PropertyList({
  initialItems,
  initialPage,
  initialTotalPages,
  initialTotal,
}: PropertyListProps) {
  const [items, setItems] = useState<PropertyListItem[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [totalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPage < initialTotalPages);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    const nextPage = page + 1;
    const result = await listProperties({
      page: String(nextPage),
      pageSize: String(PAGE_SIZE),
    });

    if (result.ok) {
      setItems((prev) => [...prev, ...result.data.items]);
      setPage(nextPage);
      setHasMore(nextPage < result.data.totalPages);
    } else {
      setError('Não foi possível carregar mais imóveis. Tente novamente.');
    }

    setLoading(false);
    loadingRef.current = false;
  }, [hasMore, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '300px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  if (items.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-text-muted text-sm">Nenhum imóvel encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-text-muted mb-4">
        <span className="font-medium text-text-body">{initialTotal}</span>{' '}
        {initialTotal === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <PropertyCard
            key={item.id}
            code={item.code}
            name={item.name}
            city={item.address?.city ?? ''}
            state={item.address?.state ?? ''}
            coverImage={
              item.images[0]
                ? { url: item.images[0].url, alt: item.images[0].alt }
                : undefined
            }
          />
        ))}

        {loading && <PropertyCardSkeletonGrid count={PAGE_SIZE} />}
      </div>

      {error && (
        <div className="mt-6 text-center">
          <p className="text-sm text-danger mb-3">{error}</p>
          <button
            onClick={loadMore}
            className="text-sm text-primary hover:underline cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!hasMore && items.length > 0 && (
      <p className="text-center text-text-subtle text-sm py-10">
        {initialTotal === 1
          ? 'Você viu o único imóvel disponível'
          : `Você viu todos os ${initialTotal} imóveis`}
      </p>
      )}

      {/* Sentinel invisível — dispara o IntersectionObserver */}
      <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
    </div>
  );
}
