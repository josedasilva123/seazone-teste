import { describe, it, expect } from 'vitest';
import { getPropertyByCodeSchema } from './getPropertyByCodeSchema';

describe('getPropertyByCodeSchema', () => {
  it('aceita um código válido', () => {
    const result = getPropertyByCodeSchema.safeParse({ code: 'FLN001' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.code).toBe('FLN001');
  });

  it('rejeita código vazio', () => {
    const result = getPropertyByCodeSchema.safeParse({ code: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.code).toBeDefined();
    }
  });

  it('rejeita ausência do campo code', () => {
    const result = getPropertyByCodeSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
