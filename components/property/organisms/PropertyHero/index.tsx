'use client';

import { useState } from 'react';
import { MdChevronLeft, MdChevronRight, MdLocationOn } from 'react-icons/md';
import { Badge } from '@/components/shared/atoms/Badge';
import { PropertyMeta } from '@/components/property/molecules/PropertyMeta';

interface PropertyImage {
  url: string;
  alt: string;
  order: number;
}

interface PropertyHeroProps {
  name: string;
  propertyType: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  images: PropertyImage[];
}

export function PropertyHero({
  name,
  propertyType,
  city,
  state,
  bedrooms,
  bathrooms,
  maxGuests,
  images,
}: PropertyHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const total = sorted.length;

  function prev() {
    setCurrentIndex((i) => (i === 0 ? total - 1 : i - 1));
  }

  function next() {
    setCurrentIndex((i) => (i === total - 1 ? 0 : i + 1));
  }

  return (
    <div className="w-full">
      {/* Gallery */}
      <div className="relative w-full aspect-[16/9] bg-surface-secondary overflow-hidden rounded-[--radius-xl]">
        {sorted.length > 0 ? (
          <>
            <img
              src={sorted[currentIndex].url}
              alt={sorted[currentIndex].alt || name}
              className="w-full h-full object-cover"
            />

            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Foto anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
                >
                  <MdChevronLeft size={22} />
                </button>
                <button
                  onClick={next}
                  aria-label="Próxima foto"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
                >
                  <MdChevronRight size={22} />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {sorted.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      aria-label={`Foto ${i + 1}`}
                      className={[
                        'w-1.5 h-1.5 rounded-full transition-all cursor-pointer',
                        i === currentIndex ? 'bg-white scale-125' : 'bg-white/50',
                      ].join(' ')}
                    />
                  ))}
                </div>

                <span className="absolute top-3 right-3 text-xs text-white bg-black/50 rounded-full px-2.5 py-1">
                  {currentIndex + 1} / {total}
                </span>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-subtle text-sm">
            Sem fotos disponíveis
          </div>
        )}
      </div>

      {/* Property info */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="primary" size="sm">
            {propertyType}
          </Badge>
        </div>

        <h1 className="text-2xl font-bold text-text-heading leading-tight">{name}</h1>

        <div className="flex items-center gap-1.5 text-text-muted text-sm">
          <MdLocationOn size={16} className="text-primary shrink-0" />
          <span>
            {city}, {state}
          </span>
        </div>

        <PropertyMeta bedrooms={bedrooms} bathrooms={bathrooms} maxGuests={maxGuests} />
      </div>
    </div>
  );
}
