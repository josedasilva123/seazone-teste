'use client';

import { useEffect, useState } from 'react';
import { MdRestaurant, MdAttractions, MdLocalPharmacy, MdShoppingCart, MdLocalHospital, MdLocationOn, MdAutoAwesome, MdWbSunny } from 'react-icons/md';
import { SectionTitle } from '@/components/shared/molecules';

interface Place {
  id: string;
  name: string;
  category: string;
  placeType?: string | null;
  distance: string;
  description: string;
}

interface Guide {
  id: string;
  welcomeMessage: string;
  seasonalTips: string;
  aiGeneratedAt: string | null;
  places: Place[];
}

interface ExperienceGuideSectionProps {
  code: string;
}

function EssentialIcon({ placeType }: { placeType?: string | null }) {
  if (placeType === 'pharmacy') return <MdLocalPharmacy size={16} className="text-success" />;
  if (placeType === 'hospital') return <MdLocalHospital size={16} className="text-danger" />;
  return <MdShoppingCart size={16} className="text-primary" />;
}

function GuideSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-16 bg-surface-secondary rounded-[--radius-lg]" />
      <div className="space-y-3">
        <div className="h-5 bg-surface-secondary rounded w-40" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-surface-secondary rounded-[--radius-md]" />
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-5 bg-surface-secondary rounded w-40" />
        {[1, 2].map((i) => (
          <div key={i} className="h-14 bg-surface-secondary rounded-[--radius-md]" />
        ))}
      </div>
    </div>
  );
}

function GeneratingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-light">
        <MdAutoAwesome size={28} className="text-primary animate-spin" style={{ animationDuration: '2s' }} />
      </div>
      <div>
        <p className="font-semibold text-text-heading text-sm">Gerando guia personalizado...</p>
        <p className="text-xs text-text-muted mt-1">A IA está descobrindo os melhores spots da região</p>
      </div>
    </div>
  );
}

export function ExperienceGuideSection({ code }: ExperienceGuideSectionProps) {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchGuide() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/${code}/guide`, { method: 'GET' });
        const data = await res.json() as { ok: boolean; data?: Guide; error?: string };

        if (cancelled) return;

        if (!data.ok || !data.data) {
          setError(data.error ?? 'Erro ao carregar guia');
          return;
        }

        // Se o guia ainda não foi gerado pela IA, mostra indicador e aguarda
        if (!data.data.aiGeneratedAt) {
          setGenerating(true);
          const genRes = await fetch(`/api/${code}/guide`, { method: 'GET' });
          const genData = await genRes.json() as { ok: boolean; data?: Guide; error?: string };
          if (cancelled) return;
          setGenerating(false);
          if (genData.ok && genData.data) {
            setGuide(genData.data);
          } else {
            setError(genData.error ?? 'Erro ao gerar guia');
          }
        } else {
          setGuide(data.data);
        }
      } catch {
        if (!cancelled) setError('Não foi possível carregar o guia. Tente novamente.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchGuide();
    return () => { cancelled = true; };
  }, [code]);

  const restaurants = guide?.places.filter((p) => p.category === 'restaurant') ?? [];
  const attractions = guide?.places.filter((p) => p.category === 'attraction') ?? [];
  const essentials = guide?.places.filter((p) => p.category === 'essential') ?? [];

  return (
    <section>
      <SectionTitle
        title="Guia de Experiências"
        subtitle="Descubra o melhor da região ao redor do seu imóvel"
      />

      {loading && !generating && <GuideSkeleton />}
      {generating && <GeneratingState />}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-[--radius-md] bg-danger-light border border-danger/20">
          <span className="text-sm text-danger">{error}</span>
        </div>
      )}

      {guide && !loading && (
        <div className="space-y-6 mt-4">
          {/* Welcome message */}
          <div className="p-4 rounded-[--radius-lg] bg-primary-light border border-primary/15">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <MdAutoAwesome size={18} className="text-primary" />
              </div>
              <p className="text-sm text-text-body leading-relaxed">{guide.welcomeMessage}</p>
            </div>
          </div>

          {/* Seasonal tip */}
          {guide.seasonalTips && (
            <div className="p-4 rounded-[--radius-lg] bg-warning-light border border-warning/20">
              <div className="flex items-start gap-3">
                <MdWbSunny size={18} className="text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-warning uppercase tracking-wide mb-1">Dica da temporada</p>
                  <p className="text-sm text-text-body leading-relaxed">{guide.seasonalTips}</p>
                </div>
              </div>
            </div>
          )}

          {/* Restaurants */}
          {restaurants.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-heading mb-3">
                <MdRestaurant size={16} className="text-primary" />
                Restaurantes próximos
              </h3>
              <ul className="space-y-2">
                {restaurants.map((r) => (
                  <li key={r.id} className="p-3 rounded-[--radius-md] bg-surface border border-border shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-text-heading">{r.name}</span>
                      <span className="text-xs text-text-muted flex items-center gap-0.5 shrink-0">
                        <MdLocationOn size={12} />
                        {r.distance}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{r.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Attractions */}
          {attractions.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-heading mb-3">
                <MdAttractions size={16} className="text-primary" />
                Atrações próximas
              </h3>
              <ul className="space-y-2">
                {attractions.map((a) => (
                  <li key={a.id} className="p-3 rounded-[--radius-md] bg-surface border border-border shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-text-heading">{a.name}</span>
                      <span className="text-xs text-text-muted flex items-center gap-0.5 shrink-0">
                        <MdLocationOn size={12} />
                        {a.distance}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{a.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Essentials */}
          {essentials.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-heading mb-3">
                <MdLocalPharmacy size={16} className="text-primary" />
                Serviços essenciais
              </h3>
              <ul className="space-y-2">
                {essentials.map((e) => (
                  <li key={e.id} className="p-3 rounded-[--radius-md] bg-surface border border-border shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <EssentialIcon placeType={e.placeType} />
                        <span className="text-sm font-medium text-text-heading">{e.name}</span>
                      </div>
                      <span className="text-xs text-text-muted flex items-center gap-0.5 shrink-0">
                        <MdLocationOn size={12} />
                        {e.distance}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-1 ml-6 leading-relaxed">{e.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
