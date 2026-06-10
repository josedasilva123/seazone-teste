import type { Metadata } from 'next';
import { getSiteUrl } from './siteUrl';

export const SITE_NAME = 'Seazone';

const DEFAULT_TITLE = 'Guia Digital do Hóspede | Seazone';
const DEFAULT_DESCRIPTION =
  'Acesse todas as informações do seu imóvel: WiFi, regras, check-in, amenidades e contato do anfitrião.';

export function createDefaultMetadata(): Metadata {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: SITE_NAME,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      url: siteUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    },
  };
}

interface PropertyMetadataInput {
  code: string;
  name: string;
  city?: string;
  state?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
}

export function createPropertyMetadata({
  code,
  name,
  city,
  state,
  coverImageUrl,
  coverImageAlt,
}: PropertyMetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const location = [city, state].filter(Boolean).join(', ');
  const title = `${name}${location ? ` — ${location}` : ''} | Guia do Hóspede Seazone`;
  const description = `Guia digital do hóspede para ${name}. Acesse WiFi, informações de check-in, regras e contato do anfitrião.`;
  const url = `${siteUrl}/${code.toUpperCase()}`;

  const images = coverImageUrl
    ? [{ url: coverImageUrl, alt: coverImageAlt ?? name }]
    : undefined;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: SITE_NAME,
      title,
      description,
      url,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(images ? { images: images.map((image) => image.url) } : {}),
    },
  };
}
