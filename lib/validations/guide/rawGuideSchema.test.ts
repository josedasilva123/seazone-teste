import { describe, it, expect } from 'vitest';
import {
  getGuidePlacesCompletenessIssues,
  getRawGuideValidationIssues,
  isGuidePlacesComplete,
} from './rawGuideSchema';

const validRawGuide = {
  welcomeMessage: 'Bem-vindo ao imóvel!',
  seasonalTips: 'Aproveite o verão na cidade.',
  restaurants: [
    { name: 'R1', distance: '1 km', description: 'Desc 1' },
    { name: 'R2', distance: '2 km', description: 'Desc 2' },
    { name: 'R3', distance: '3 km', description: 'Desc 3' },
    { name: 'R4', distance: '4 km', description: 'Desc 4' },
  ],
  attractions: [
    { name: 'A1', distance: '1 km', description: 'Desc 1' },
    { name: 'A2', distance: '2 km', description: 'Desc 2' },
    { name: 'A3', distance: '3 km', description: 'Desc 3' },
  ],
  essentials: [
    { name: 'Farmácia X', placeType: 'pharmacy', distance: '500 m', description: '24h' },
    { name: 'Mercado Y', placeType: 'supermarket', distance: '800 m', description: 'Grande' },
    { name: 'Hospital Z', placeType: 'hospital', distance: '2 km', description: 'Público' },
  ],
};

describe('getRawGuideValidationIssues', () => {
  it('retorna vazio para guia válido', () => {
    expect(getRawGuideValidationIssues(validRawGuide)).toEqual([]);
  });

  it('rejeita guia com poucos restaurantes', () => {
    const issues = getRawGuideValidationIssues({
      ...validRawGuide,
      restaurants: validRawGuide.restaurants.slice(0, 2),
    });

    expect(issues.length).toBeGreaterThan(0);
  });

  it('rejeita guia com poucas atrações', () => {
    const issues = getRawGuideValidationIssues({
      ...validRawGuide,
      attractions: validRawGuide.attractions.slice(0, 1),
    });

    expect(issues.length).toBeGreaterThan(0);
  });

  it('rejeita guia sem hospital nos essenciais', () => {
    const issues = getRawGuideValidationIssues({
      ...validRawGuide,
      essentials: validRawGuide.essentials.filter((e) => e.placeType !== 'hospital'),
    });

    expect(issues.some((issue) => issue.toLowerCase().includes('hospital'))).toBe(true);
  });
});

describe('isGuidePlacesComplete', () => {
  it('retorna true quando há quantidade mínima de lugares', () => {
    const places = [
      ...Array.from({ length: 4 }, (_, i) => ({ category: 'restaurant', placeType: null })),
      ...Array.from({ length: 3 }, (_, i) => ({ category: 'attraction', placeType: null })),
      { category: 'essential', placeType: 'pharmacy' },
      { category: 'essential', placeType: 'supermarket' },
      { category: 'essential', placeType: 'hospital' },
    ];

    expect(isGuidePlacesComplete(places)).toBe(true);
    expect(getGuidePlacesCompletenessIssues(places)).toEqual([]);
  });

  it('retorna false quando há apenas 2 restaurantes', () => {
    const places = [
      { category: 'restaurant', placeType: null },
      { category: 'restaurant', placeType: null },
      ...Array.from({ length: 3 }, () => ({ category: 'attraction', placeType: null })),
      { category: 'essential', placeType: 'pharmacy' },
      { category: 'essential', placeType: 'supermarket' },
      { category: 'essential', placeType: 'hospital' },
    ];

    expect(isGuidePlacesComplete(places)).toBe(false);
    expect(getGuidePlacesCompletenessIssues(places).some((issue) => issue.includes('restaurante'))).toBe(true);
  });
});
