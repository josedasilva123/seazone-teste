import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPropertyByCode } from './getPropertyByCode';

vi.mock('@/lib/services/property', () => ({
  PropertyService: {
    getByCode: vi.fn(),
  },
}));

import { PropertyService } from '@/lib/services/property';

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

describe('getPropertyByCode', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retorna ok:true com o imóvel quando encontrado', async () => {
    vi.mocked(PropertyService.getByCode).mockResolvedValue(mockProperty as never);

    const result = await getPropertyByCode('FLN001');

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.code).toBe('FLN001');
  });

  it('retorna ok:false quando código é string vazia', async () => {
    const result = await getPropertyByCode('');

    expect(result.ok).toBe(false);
    expect(PropertyService.getByCode).not.toHaveBeenCalled();
  });

  it('retorna ok:false com mensagem de erro quando service lança', async () => {
    vi.mocked(PropertyService.getByCode).mockRejectedValue(
      new Error('Imóvel com código "XYZ" não encontrado.'),
    );

    const result = await getPropertyByCode('XYZ');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Imóvel com código "XYZ" não encontrado.');
    }
  });

  it('retorna ok:false com "Erro desconhecido" para erros não-Error', async () => {
    vi.mocked(PropertyService.getByCode).mockRejectedValue('falha estranha');

    const result = await getPropertyByCode('FLN001');

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('Erro desconhecido');
  });
});
