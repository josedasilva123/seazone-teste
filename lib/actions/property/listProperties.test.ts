import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listProperties } from './listProperties';

vi.mock('@/lib/services/property', () => ({
  PropertyService: {
    list: vi.fn(),
  },
}));

import { PropertyService } from '@/lib/services/property';

const mockListResult = {
  items: [],
  total: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

describe('listProperties', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retorna ok:true com resultados paginados', async () => {
    vi.mocked(PropertyService.list).mockResolvedValue(mockListResult as never);

    const result = await listProperties({ page: '1', pageSize: '10' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.total).toBe(1);
      expect(result.data.totalPages).toBe(1);
    }
  });

  it('aplica defaults quando params está vazio', async () => {
    vi.mocked(PropertyService.list).mockResolvedValue(mockListResult as never);

    await listProperties({});

    expect(PropertyService.list).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, pageSize: 10 }),
    );
  });

  it('retorna ok:false para page inválido', async () => {
    const result = await listProperties({ page: '0' });

    expect(result.ok).toBe(false);
    expect(PropertyService.list).not.toHaveBeenCalled();
  });

  it('retorna ok:false para pageSize maior que 100', async () => {
    const result = await listProperties({ pageSize: '200' });

    expect(result.ok).toBe(false);
    expect(PropertyService.list).not.toHaveBeenCalled();
  });

  it('repassa filtros opcionais ao service', async () => {
    vi.mocked(PropertyService.list).mockResolvedValue(mockListResult as never);

    await listProperties({ city: 'Gramado', state: 'RS', allowPet: 'true' });

    expect(PropertyService.list).toHaveBeenCalledWith(
      expect.objectContaining({ city: 'Gramado', state: 'RS', allowPet: true }),
    );
  });

  it('retorna ok:false com mensagem quando service lança', async () => {
    vi.mocked(PropertyService.list).mockRejectedValue(new Error('DB indisponível'));

    const result = await listProperties({});

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('DB indisponível');
  });
});
