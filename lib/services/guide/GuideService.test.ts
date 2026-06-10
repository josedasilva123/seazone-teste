import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GuideService } from './GuideService';

vi.mock('@/lib/ai', () => ({
  generateJsonContent: vi.fn(),
}));

vi.mock('@/lib/repositories/guide', () => ({
  GuideRepository: {
    findByPropertyCode: vi.fn(),
    upsertGenerated: vi.fn(),
  },
}));

vi.mock('@/lib/repositories/property', () => ({
  PropertyRepository: {
    findByCode: vi.fn(),
  },
}));

import { generateJsonContent } from '@/lib/ai';
import { GuideRepository } from '@/lib/repositories/guide';
import { PropertyRepository } from '@/lib/repositories/property';

const mockProperty = {
  name: 'Apartamento Centro',
  code: 'FLN001',
  address: {
    street: 'Rua das Flores',
    number: '100',
    neighborhood: 'Centro',
    city: 'Florianópolis',
    state: 'SC',
  },
};

const validRawGuide = {
  welcomeMessage: 'Bem-vindo!',
  seasonalTips: 'Aproveite o verão.',
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

const incompleteRawGuide = {
  ...validRawGuide,
  restaurants: validRawGuide.restaurants.slice(0, 2),
  attractions: validRawGuide.attractions.slice(0, 1),
};

const completeGuide = {
  id: 'guide-1',
  aiGeneratedAt: new Date('2024-01-01'),
  welcomeMessage: 'Olá',
  seasonalTips: 'Dica',
  places: [
    ...Array.from({ length: 4 }, (_, i) => ({
      id: `r${i}`,
      name: `Restaurante ${i}`,
      category: 'restaurant',
      distance: '1 km',
      description: 'Desc',
      placeType: null,
    })),
    ...Array.from({ length: 3 }, (_, i) => ({
      id: `a${i}`,
      name: `Atração ${i}`,
      category: 'attraction',
      distance: '2 km',
      description: 'Desc',
      placeType: null,
    })),
    { id: 'e1', name: 'Farmácia', category: 'essential', distance: '500 m', description: 'Desc', placeType: 'pharmacy' },
    { id: 'e2', name: 'Mercado', category: 'essential', distance: '800 m', description: 'Desc', placeType: 'supermarket' },
    { id: 'e3', name: 'Hospital', category: 'essential', distance: '2 km', description: 'Desc', placeType: 'hospital' },
  ],
};

const incompleteGuide = {
  ...completeGuide,
  places: completeGuide.places.filter((p) => p.category !== 'restaurant').slice(0, 4),
};

describe('GuideService.getOrGenerate', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retorna guia em cache quando já está completo', async () => {
    vi.mocked(GuideRepository.findByPropertyCode).mockResolvedValue(completeGuide as never);

    const result = await GuideService.getOrGenerate('FLN001');

    expect(result).toEqual(completeGuide);
    expect(generateJsonContent).not.toHaveBeenCalled();
    expect(PropertyRepository.findByCode).not.toHaveBeenCalled();
  });

  it('regenera guia em cache quando está incompleto', async () => {
    vi.mocked(GuideRepository.findByPropertyCode).mockResolvedValue(incompleteGuide as never);
    vi.mocked(PropertyRepository.findByCode).mockResolvedValue(mockProperty as never);
    vi.mocked(generateJsonContent).mockResolvedValue(JSON.stringify(validRawGuide));
    vi.mocked(GuideRepository.upsertGenerated).mockResolvedValue(completeGuide as never);

    await GuideService.getOrGenerate('FLN001');

    expect(generateJsonContent).toHaveBeenCalled();
    expect(GuideRepository.upsertGenerated).toHaveBeenCalledWith('FLN001', expect.objectContaining({
      places: expect.arrayContaining([
        expect.objectContaining({ category: 'restaurant' }),
        expect.objectContaining({ category: 'attraction' }),
        expect.objectContaining({ category: 'essential' }),
      ]),
    }));
  });

  it('tenta novamente quando a IA retorna poucos lugares', async () => {
    vi.mocked(GuideRepository.findByPropertyCode).mockResolvedValue(null);
    vi.mocked(PropertyRepository.findByCode).mockResolvedValue(mockProperty as never);
    vi.mocked(generateJsonContent)
      .mockResolvedValueOnce(JSON.stringify(incompleteRawGuide))
      .mockResolvedValueOnce(JSON.stringify(validRawGuide));
    vi.mocked(GuideRepository.upsertGenerated).mockResolvedValue(completeGuide as never);

    await GuideService.getOrGenerate('FLN001');

    expect(generateJsonContent).toHaveBeenCalledTimes(2);
    expect(generateJsonContent.mock.calls[1]?.[1]).toContain('REJEITADA');
    expect(GuideRepository.upsertGenerated).toHaveBeenCalled();
  });

  it('retorna guia existente como fallback quando todas as tentativas falham', async () => {
    vi.mocked(GuideRepository.findByPropertyCode).mockResolvedValue(incompleteGuide as never);
    vi.mocked(PropertyRepository.findByCode).mockResolvedValue(mockProperty as never);
    vi.mocked(generateJsonContent).mockResolvedValue(JSON.stringify(incompleteRawGuide));

    const result = await GuideService.getOrGenerate('FLN001');

    expect(generateJsonContent).toHaveBeenCalledTimes(3);
    expect(result).toEqual(incompleteGuide);
    expect(GuideRepository.upsertGenerated).not.toHaveBeenCalled();
  });
});
