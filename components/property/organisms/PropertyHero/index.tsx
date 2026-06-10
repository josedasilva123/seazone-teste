'use client';

import { useState } from 'react';
import {
  MdChevronLeft,
  MdChevronRight,
  MdLocationOn,
  MdBed,
  MdBathtub,
  MdPeople,
} from 'react-icons/md';

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

      <div className="absolute top-3 left-4 z-10">
        <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-primary text-white shadow">
          {propertyType}
        </span>
      </div>

      {total > 1 && (
        <span className="absolute top-3 right-4 z-10 text-xs text-white bg-black/50 rounded-full px-2.5 py-1 backdrop-blur-sm">
          {currentIndex + 1} / {total}
        </span>
      )}

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
              <button
                onClick={prev}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-black/45 text-white hover:bg-black/65 transition-colors cursor-pointer"
              >
                <MdChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                aria-label="Próxima foto"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-black/45 text-white hover:bg-black/65 transition-colors cursor-pointer"
              >
                <MdChevronRight size={20} />
              </button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
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
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0 text-[11px] text-white/65">
          <span className="flex items-center gap-1">
            <MdBed size={12} />
            {bedrooms} quarto{bedrooms !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <MdBathtub size={12} />
            {bathrooms} banheiro{bathrooms !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <MdPeople size={12} />
            até {maxGuests} hóspede{maxGuests !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
