import { afterEach, describe, expect, it } from 'vitest';
import { createDefaultMetadata, createPropertyMetadata } from './metadata';

describe('createDefaultMetadata', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('define metadataBase e openGraph padrão', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://guia.seazone.com.br';

    const metadata = createDefaultMetadata();

    expect(metadata.metadataBase?.toString()).toBe('https://guia.seazone.com.br/');
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Seazone',
      url: 'https://guia.seazone.com.br',
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
    });
  });
});

describe('createPropertyMetadata', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('monta título, URL e imagem do imóvel', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://guia.seazone.com.br';

    const metadata = createPropertyMetadata({
      code: 'fln001',
      name: 'Apartamento Beira-Mar',
      city: 'Florianópolis',
      state: 'SC',
      coverImageUrl: 'https://images.example.com/cover.jpg',
      coverImageAlt: 'Vista do mar',
    });

    expect(metadata.title).toBe(
      'Apartamento Beira-Mar — Florianópolis, SC | Guia do Hóspede Seazone',
    );
    expect(metadata.openGraph).toMatchObject({
      url: 'https://guia.seazone.com.br/FLN001',
      images: [{ url: 'https://images.example.com/cover.jpg', alt: 'Vista do mar' }],
    });
    expect(metadata.twitter?.images).toEqual(['https://images.example.com/cover.jpg']);
  });

  it('omite imagem quando o imóvel não tem foto', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://guia.seazone.com.br';

    const metadata = createPropertyMetadata({
      code: 'ABC123',
      name: 'Chalé Serra',
    });

    expect(metadata.openGraph?.images).toBeUndefined();
    expect(metadata.twitter?.images).toBeUndefined();
  });
});
