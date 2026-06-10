import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  GeminiConfigError,
  isGeminiAuthError,
  isGeminiQuotaError,
  isGeminiConfigured,
  getGeminiApiKey,
} from './gemini';

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

  it('retorna false para erro de configuração', () => {
    expect(isGeminiQuotaError(new GeminiConfigError('GEMINI_API_KEY não configurada'))).toBe(false);
  });

  it('retorna false para erro de autenticação', () => {
    expect(isGeminiQuotaError(new Error('API key not valid. Please pass a valid API key.'))).toBe(false);
  });

  it('retorna false para outros erros', () => {
    expect(isGeminiQuotaError(new Error('network error'))).toBe(false);
  });

  it('retorna false para não-errors', () => {
    expect(isGeminiQuotaError(null)).toBe(false);
  });
});

describe('isGeminiAuthError', () => {
  it('detecta API key inválida', () => {
    expect(isGeminiAuthError(new Error('API key not valid. Please pass a valid API key.'))).toBe(true);
  });

  it('retorna false para quota', () => {
    expect(isGeminiAuthError(new Error('429 quota exceeded'))).toBe(false);
  });
});

describe('getGeminiApiKey', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('remove espaços em branco da chave', () => {
    vi.stubEnv('GEMINI_API_KEY', '  AIza-test-key  ');
    expect(getGeminiApiKey()).toBe('AIza-test-key');
    expect(isGeminiConfigured()).toBe(true);
  });

  it('retorna null quando ausente', () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    expect(getGeminiApiKey()).toBeNull();
    expect(isGeminiConfigured()).toBe(false);
  });
});
