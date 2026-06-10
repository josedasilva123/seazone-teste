import { describe, it, expect } from 'vitest';
import { isGeminiQuotaError } from './gemini';

describe('isGeminiQuotaError', () => {
  it('detecta erro 429', () => {
    expect(isGeminiQuotaError(new Error('429 Too Many Requests'))).toBe(true);
  });

  it('detecta RESOURCE_EXHAUSTED do Gemini', () => {
    expect(isGeminiQuotaError(new Error('[GoogleGenerativeAI Error]: RESOURCE_EXHAUSTED'))).toBe(true);
  });

  it('detecta rate limit', () => {
    expect(isGeminiQuotaError(new Error('rate limit exceeded'))).toBe(true);
  });

  it('retorna false para outros erros', () => {
    expect(isGeminiQuotaError(new Error('network error'))).toBe(false);
  });

  it('retorna false para não-errors', () => {
    expect(isGeminiQuotaError(null)).toBe(false);
  });
});
