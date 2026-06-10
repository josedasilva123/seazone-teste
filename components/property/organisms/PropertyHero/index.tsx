'use client';

import { useState } from 'react';
import { MdChevronLeft, MdChevronRight, MdLocationOn } from 'react-icons/md';
import { Button } from '@/components/shared/atoms';
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
  propertyType: _propertyType,
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
    <div className="relative w-full bg-gray-900 overflow-hidden">

      {sorted.length > 0 && (
        <img
          src={sorted[currentIndex].url}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/25" />

      {/* Carrossel: sempre 16/9, máx 800px */}
      <div className="relative z-10 flex justify-center px-4 pt-10 pb-2">
        <div className="relative w-full max-w-[800px] aspect-video rounded-[--radius-xl] overflow-hidden shadow-2xl ring-1 ring-white/15">
          {sorted.length > 0 ? (
            <img
              src={sorted[currentIndex].url}
              alt={sorted[currentIndex].alt || name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm bg-gray-800">
              Sem fotos disponíveis
            </div>
          )}

          {total > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prev}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 rounded-full bg-black/45 text-white hover:bg-black/65 hover:text-white"
              >
                <MdChevronLeft size={20} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={next}
                aria-label="Próxima foto"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 rounded-full bg-black/45 text-white hover:bg-black/65 hover:text-white"
              >
                <MdChevronRight size={20} />
              </Button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {sorted.map((_, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Foto ${i + 1}`}
                    className={[
                      'w-1.5 h-1.5 min-w-0 p-0 rounded-full transition-all',
                      i === currentIndex ? 'bg-white scale-125 hover:bg-white' : 'bg-white/50 hover:bg-white/50',
                    ].join(' ')}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 px-5 pt-2 pb-4">
        <h1 className="text-base font-bold leading-snug text-white drop-shadow">{name}</h1>
        <div className="flex items-center gap-1.5 text-white/75 text-xs mt-0.5 mb-1">
          <MdLocationOn size={12} className="shrink-0" />
          <span>{city}, {state}</span>
        </div>
        <PropertyMeta
          bedrooms={bedrooms}
          bathrooms={bathrooms}
          maxGuests={maxGuests}
          tone="inverse"
          size="sm"
        />
      </div>
    </div>
  );
}
