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
    <div>
      <Skeleton className="aspect-square w-full rounded-[--radius-xl]" />
      <div className="pt-3 px-0.5 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
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
