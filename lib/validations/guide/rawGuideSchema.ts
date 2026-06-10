import { z } from 'zod';

export const GUIDE_MIN_RESTAURANTS = 4;
export const GUIDE_MIN_ATTRACTIONS = 3;
export const GUIDE_MAX_RESTAURANTS = 5;
export const GUIDE_MAX_ATTRACTIONS = 4;

const placeSchema = z.object({
  name: z.string().min(1),
  distance: z.string().min(1),
  description: z.string().min(1),
});

const essentialPlaceSchema = placeSchema.extend({
  placeType: z.enum(['pharmacy', 'supermarket', 'hospital']),
});

export const rawGuideSchema = z.object({
  welcomeMessage: z.string().min(1),
  seasonalTips: z.string().min(1),
  restaurants: z.array(placeSchema).min(GUIDE_MIN_RESTAURANTS).max(GUIDE_MAX_RESTAURANTS),
  attractions: z.array(placeSchema).min(GUIDE_MIN_ATTRACTIONS).max(GUIDE_MAX_ATTRACTIONS),
  essentials: z.array(essentialPlaceSchema).min(3),
}).superRefine((data, ctx) => {
  const types = new Set(data.essentials.map((e) => e.placeType));
  if (!types.has('pharmacy')) {
    ctx.addIssue({
      code: 'custom',
      message: 'Inclua pelo menos 1 farmácia (placeType: "pharmacy") em essentials.',
      path: ['essentials'],
    });
  }
  if (!types.has('supermarket')) {
    ctx.addIssue({
      code: 'custom',
      message: 'Inclua pelo menos 1 supermercado (placeType: "supermarket") em essentials.',
      path: ['essentials'],
    });
  }
  if (!types.has('hospital')) {
    ctx.addIssue({
      code: 'custom',
      message: 'Inclua pelo menos 1 hospital (placeType: "hospital") em essentials.',
      path: ['essentials'],
    });
  }
});

export type RawGuide = z.infer<typeof rawGuideSchema>;

export interface GuidePlaceLike {
  category: string;
  placeType?: string | null;
}

export function getGuidePlacesCompletenessIssues(places: GuidePlaceLike[]): string[] {
  const issues: string[] = [];
  const restaurants = places.filter((p) => p.category === 'restaurant').length;
  const attractions = places.filter((p) => p.category === 'attraction').length;
  const essentials = places.filter((p) => p.category === 'essential');
  const types = new Set(essentials.map((e) => e.placeType).filter(Boolean));

  if (restaurants < GUIDE_MIN_RESTAURANTS) {
    issues.push(
      `Apenas ${restaurants} restaurante(s) no guia; o mínimo obrigatório é ${GUIDE_MIN_RESTAURANTS}.`,
    );
  }
  if (attractions < GUIDE_MIN_ATTRACTIONS) {
    issues.push(
      `Apenas ${attractions} atração(ões) no guia; o mínimo obrigatório é ${GUIDE_MIN_ATTRACTIONS}.`,
    );
  }
  if (!types.has('pharmacy')) {
    issues.push('Falta pelo menos 1 farmácia nos serviços essenciais.');
  }
  if (!types.has('supermarket')) {
    issues.push('Falta pelo menos 1 supermercado nos serviços essenciais.');
  }
  if (!types.has('hospital')) {
    issues.push('Falta pelo menos 1 hospital nos serviços essenciais.');
  }

  return issues;
}

export function isGuidePlacesComplete(places: GuidePlaceLike[]): boolean {
  return getGuidePlacesCompletenessIssues(places).length === 0;
}

export function getRawGuideValidationIssues(data: unknown): string[] {
  const result = rawGuideSchema.safeParse(data);
  if (result.success) return [];

  return result.error.issues.map((issue) => issue.message);
}
