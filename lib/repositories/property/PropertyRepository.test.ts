import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PropertyRepository } from './PropertyRepository';

vi.mock('@/lib/db', () => ({
  db: {
    property: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { db } from '@/lib/db';

const mockProperty = {
  id: 'clx001',
  code: 'FLN001',
  name: 'Apartamento Beira-Mar Florianópolis',
  propertyType: 'Apartamento',
  bedroomQuantity: 2,
  bathroomQuantity: 1,
  guestCapacity: 4,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  address: { city: 'Florianópolis', state: 'SC' },
  operational: null,
  rules: { allowPet: false },
  amenities: { wifi: true },
  images: [{ id: 'img1', url: 'https://example.com/img.jpg', alt: '', order: 0, propertyId: 'clx001' }],
  host: { name: 'Ana Paula', phone: '+55489' },
  localGuide: null,
};

describe('PropertyRepository.findByCode', () => {
  beforeEach(() => vi.clearAllMocks());

  it('chama db.property.findUnique com o código correto', async () => {
    vi.mocked(db.property.findUnique).mockResolvedValue(mockProperty as never);

    const result = await PropertyRepository.findByCode('FLN001');

    expect(db.property.findUnique).toHaveBeenCalledOnce();
    expect(db.property.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { code: 'FLN001' } }),
    );
    expect(result).toEqual(mockProperty);
  });

  it('retorna null quando o imóvel não existe', async () => {
    vi.mocked(db.property.findUnique).mockResolvedValue(null);

    const result = await PropertyRepository.findByCode('INEXISTENTE');

    expect(result).toBeNull();
  });
});

describe('PropertyRepository.list', () => {
  beforeEach(() => vi.clearAllMocks());

  const baseInput = { page: 1, pageSize: 10 };

  it('retorna itens e metadados de paginação', async () => {
    vi.mocked(db.property.count).mockResolvedValue(2);
    vi.mocked(db.property.findMany).mockResolvedValue([mockProperty, mockProperty] as never);

    const result = await PropertyRepository.list(baseInput);

    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(result.items).toHaveLength(2);
  });

  it('calcula skip correto para página 2', async () => {
    vi.mocked(db.property.count).mockResolvedValue(25);
    vi.mocked(db.property.findMany).mockResolvedValue([]);

    await PropertyRepository.list({ page: 2, pageSize: 10 });

    expect(db.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 10 }),
    );
  });

  it('calcula totalPages corretamente para resultado parcial', async () => {
    vi.mocked(db.property.count).mockResolvedValue(25);
    vi.mocked(db.property.findMany).mockResolvedValue([]);

    const result = await PropertyRepository.list({ page: 1, pageSize: 10 });

    expect(result.totalPages).toBe(3);
  });

  it('inclui filtro de city quando fornecido', async () => {
    vi.mocked(db.property.count).mockResolvedValue(0);
    vi.mocked(db.property.findMany).mockResolvedValue([]);

    await PropertyRepository.list({ ...baseInput, city: 'Florianópolis' });

    expect(db.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          address: expect.objectContaining({
            city: { contains: 'Florianópolis' },
          }),
        }),
      }),
    );
  });

  it('inclui filtro de allowPet quando fornecido', async () => {
    vi.mocked(db.property.count).mockResolvedValue(0);
    vi.mocked(db.property.findMany).mockResolvedValue([]);

    await PropertyRepository.list({ ...baseInput, allowPet: true });

    expect(db.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ rules: { allowPet: true } }),
      }),
    );
  });

  it('não inclui where de address quando city e state são omitidos', async () => {
    vi.mocked(db.property.count).mockResolvedValue(0);
    vi.mocked(db.property.findMany).mockResolvedValue([]);

    await PropertyRepository.list(baseInput);

    const call = vi.mocked(db.property.findMany).mock.calls[0][0] as { where: Record<string, unknown> };
    expect(call.where).not.toHaveProperty('address');
  });
});
