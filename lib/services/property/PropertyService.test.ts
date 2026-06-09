import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PropertyService } from './PropertyService';

vi.mock('@/lib/repositories/property', () => ({
  PropertyRepository: {
    findByCode: vi.fn(),
    list: vi.fn(),
  },
}));

import { PropertyRepository } from '@/lib/repositories/property';

const mockProperty = {
  id: 'clx001',
  code: 'FLN001',
  name: 'Apartamento Beira-Mar Florianópolis',
  propertyType: 'Apartamento',
  bedroomQuantity: 2,
  bathroomQuantity: 1,
  guestCapacity: 4,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockListResult = {
  items: [mockProperty],
  total: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

describe('PropertyService.getByCode', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retorna o imóvel quando encontrado', async () => {
    vi.mocked(PropertyRepository.findByCode).mockResolvedValue(mockProperty as never);

    const result = await PropertyService.getByCode('FLN001');

    expect(PropertyRepository.findByCode).toHaveBeenCalledWith('FLN001');
    expect(result).toEqual(mockProperty);
  });

  it('lança erro quando imóvel não é encontrado', async () => {
    vi.mocked(PropertyRepository.findByCode).mockResolvedValue(null);

    await expect(PropertyService.getByCode('INEXISTENTE')).rejects.toThrow(
      'Imóvel com código "INEXISTENTE" não encontrado.',
    );
  });

  it('propaga erros do repository', async () => {
    vi.mocked(PropertyRepository.findByCode).mockRejectedValue(new Error('DB offline'));

    await expect(PropertyService.getByCode('FLN001')).rejects.toThrow('DB offline');
  });
});

describe('PropertyService.list', () => {
  beforeEach(() => vi.clearAllMocks());

  it('delega para o repository com os parâmetros recebidos', async () => {
    vi.mocked(PropertyRepository.list).mockResolvedValue(mockListResult as never);

    const input = { page: 1, pageSize: 10, city: 'Florianópolis' };
    const result = await PropertyService.list(input);

    expect(PropertyRepository.list).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockListResult);
  });

  it('propaga erros do repository', async () => {
    vi.mocked(PropertyRepository.list).mockRejectedValue(new Error('Timeout'));

    await expect(
      PropertyService.list({ page: 1, pageSize: 10 }),
    ).rejects.toThrow('Timeout');
  });
});
