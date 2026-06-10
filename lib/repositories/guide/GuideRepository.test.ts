import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import { GuideRepository } from '.';

vi.mock('@/lib/db', () => ({
  db: {
    localGuide: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    localGuidePlace: {
      deleteMany: vi.fn(),
    },
    property: {
      findUnique: vi.fn(),
    },
  },
}));

const mockGuide = {
  id: 'guide-1',
  welcomeMessage: 'Bem-vindo!',
  seasonalTips: 'Dica de inverno',
  aiGeneratedAt: null,
  propertyId: 'prop-1',
  places: [
    {
      id: 'p1',
      name: 'Box 32',
      category: 'restaurant',
      placeType: null,
      distance: '1,2 km',
      description: 'Ótimo boteco',
      guideId: 'guide-1',
    },
  ],
};

describe('GuideRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findByPropertyCode', () => {
    it('busca o guia pelo código do imóvel', async () => {
      vi.mocked(db.localGuide.findFirst).mockResolvedValue(mockGuide as never);

      const result = await GuideRepository.findByPropertyCode('FLN001');

      expect(db.localGuide.findFirst).toHaveBeenCalledWith({
        where: { property: { code: 'FLN001' } },
        include: { places: true },
      });
      expect(result).toEqual(mockGuide);
    });

    it('retorna null quando não existe guia', async () => {
      vi.mocked(db.localGuide.findFirst).mockResolvedValue(null);

      const result = await GuideRepository.findByPropertyCode('INVALID');

      expect(result).toBeNull();
    });
  });

  describe('upsertGenerated', () => {
    const inputData = {
      welcomeMessage: 'Nova mensagem de boas-vindas',
      seasonalTips: 'Nova dica sazonal',
      places: [
        { name: 'Restaurante Novo', category: 'restaurant', distance: '1km', description: 'Ótimo' },
      ],
    };

    it('atualiza guia existente e deleta places antigos', async () => {
      vi.mocked(db.property.findUnique).mockResolvedValue({ id: 'prop-1' } as never);
      vi.mocked(db.localGuide.findUnique).mockResolvedValue({ id: 'guide-1' } as never);
      vi.mocked(db.localGuidePlace.deleteMany).mockResolvedValue({ count: 1 } as never);
      vi.mocked(db.localGuide.update).mockResolvedValue({ ...mockGuide, aiGeneratedAt: new Date() } as never);

      await GuideRepository.upsertGenerated('FLN001', inputData);

      expect(db.localGuidePlace.deleteMany).toHaveBeenCalledWith({ where: { guideId: 'guide-1' } });
      expect(db.localGuide.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'guide-1' },
          data: expect.objectContaining({
            welcomeMessage: inputData.welcomeMessage,
            aiGeneratedAt: expect.any(Date),
          }),
        }),
      );
    });

    it('cria novo guia quando não existe', async () => {
      vi.mocked(db.property.findUnique).mockResolvedValue({ id: 'prop-2' } as never);
      vi.mocked(db.localGuide.findUnique).mockResolvedValue(null);
      vi.mocked(db.localGuide.create).mockResolvedValue({ ...mockGuide, propertyId: 'prop-2' } as never);

      await GuideRepository.upsertGenerated('GRM001', inputData);

      expect(db.localGuide.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            propertyId: 'prop-2',
            welcomeMessage: inputData.welcomeMessage,
            aiGeneratedAt: expect.any(Date),
          }),
        }),
      );
    });

    it('lança erro quando o imóvel não existe', async () => {
      vi.mocked(db.property.findUnique).mockResolvedValue(null);

      await expect(
        GuideRepository.upsertGenerated('INVALIDO', inputData),
      ).rejects.toThrow('Property not found: INVALIDO');
    });
  });
});
