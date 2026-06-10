import { describe, it, expect } from 'vitest';
import { listPropertiesSchema } from './listPropertiesSchema';

describe('listPropertiesSchema', () => {
  it('aplica defaults de page=1 e pageSize=10 quando omitidos', () => {
    const result = listPropertiesSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.pageSize).toBe(10);
    }
  });

  it('converte strings numéricas para number (coerce)', () => {
    const result = listPropertiesSchema.safeParse({ page: '2', pageSize: '20' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.pageSize).toBe(20);
    }
  });

  it('rejeita page menor que 1', () => {
    const result = listPropertiesSchema.safeParse({ page: '0' });
    expect(result.success).toBe(false);
  });

  it('rejeita pageSize maior que 100', () => {
    const result = listPropertiesSchema.safeParse({ pageSize: '101' });
    expect(result.success).toBe(false);
  });

  it('rejeita minGuests menor que 1', () => {
    const result = listPropertiesSchema.safeParse({ minGuests: '0' });
    expect(result.success).toBe(false);
  });

  it('aceita filtros opcionais válidos', () => {
    const result = listPropertiesSchema.safeParse({
      city: 'Florianópolis',
      state: 'SC',
      propertyType: 'Apartamento',
      minBedrooms: '2',
      minGuests: '4',
      allowPet: 'true',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.city).toBe('Florianópolis');
      expect(result.data.state).toBe('SC');
      expect(result.data.minBedrooms).toBe(2);
      // z.coerce.boolean() usa Boolean() nativo: qualquer string não-vazia é true
      expect(result.data.allowPet).toBe(true);
    }
  });

  it('z.coerce.boolean converte booleano nativo false corretamente', () => {
    const result = listPropertiesSchema.safeParse({ allowPet: false });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.allowPet).toBe(false);
  });

  it('permite ausência de todos os filtros opcionais', () => {
    const result = listPropertiesSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.city).toBeUndefined();
      expect(result.data.allowPet).toBeUndefined();
    }
  });
});
