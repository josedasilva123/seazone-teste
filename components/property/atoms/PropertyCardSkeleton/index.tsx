interface PropertyCardSkeletonProps {
  count?: number;
}

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-surface-secondary animate-pulse rounded-[--radius-md] ${className}`}
      aria-hidden="true"
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-[--radius-xl] overflow-hidden bg-surface border border-border shadow-sm">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="px-3 py-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function PropertyCardSkeletonGrid({ count = 6 }: PropertyCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </>
  );
}
