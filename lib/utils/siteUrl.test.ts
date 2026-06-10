import { afterEach, describe, expect, it } from 'vitest';
import { getSiteUrl } from './siteUrl';

describe('getSiteUrl', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('retorna NEXT_PUBLIC_SITE_URL sem barra final', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://guia.seazone.com.br/';
    delete process.env.VERCEL_URL;

    expect(getSiteUrl()).toBe('https://guia.seazone.com.br');
  });

  it('usa VERCEL_URL quando NEXT_PUBLIC_SITE_URL não está definido', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_URL = 'seazone-teste.vercel.app';

    expect(getSiteUrl()).toBe('https://seazone-teste.vercel.app');
  });

  it('retorna localhost em desenvolvimento local', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;

    expect(getSiteUrl()).toBe('http://localhost:3000');
  });
});
