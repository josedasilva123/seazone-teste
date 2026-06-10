import { vi } from 'vitest';
import type { AmenityKey } from '@/components/property/atoms/AmenityIcon';

export const mockExperienceGuide = {
  id: 'guide-1',
  welcomeMessage: 'Bem-vindo ao apartamento em Florianópolis!',
  seasonalTips: 'No inverno, aproveite os restaurantes de frutos do mar.',
  aiGeneratedAt: new Date().toISOString(),
  places: [
    {
      id: 'p1',
      name: 'Box 32',
      category: 'restaurant',
      placeType: null,
      distance: 'Aprox. 1,2 km',
      description: 'Famoso pelos petiscos e chopes gelados.',
    },
  ],
};

export const propertyGuideTemplateProps = {
  code: 'FLN001',
  name: 'Apartamento Vista Mar',
  propertyType: 'Apartamento',
  city: 'Florianópolis',
  state: 'SC',
  bedrooms: 2,
  bathrooms: 1,
  maxGuests: 4,
  images: [{ url: '/img.jpg', alt: 'Sala', order: 0 }],
  amenities: { wifi: true, pool: true, airConditioning: true } as Partial<Record<AmenityKey, boolean>>,
  wifi: { network: 'SeaHome_FLN001', password: 'floripa2024' },
  access: { type: 'smart_lock' as const, instructions: 'Use o código 4521.', password: '4521' },
  parking: null,
  rules: {
    checkInTime: '15:00',
    checkOutTime: '11:00',
    allowPet: false,
    smokingPermitted: false,
    suitableForChildren: true,
    suitableForBabies: false,
    eventsPermitted: false,
  },
  host: { name: 'Ana Paula', phone: '+5548991234567' },
  address: {
    street: 'Rua das Flores',
    number: '10',
    neighborhood: 'Centro',
    city: 'Florianópolis',
    state: 'SC',
    postalCode: '88010-000',
  },
};

export function createMockChatStream(text: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}

export function createMockChatResponse(text: string, isFallback = false): Response {
  return {
    ok: true,
    body: createMockChatStream(text),
    headers: { get: (key: string) => (key === 'X-Is-Fallback' && isFallback ? 'true' : null) },
  } as unknown as Response;
}

export function mockPropertyPageFetch(chatResponse = 'Resposta padrão do assistente.') {
  vi.mocked(fetch).mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();

    if (url.includes('/guide')) {
      return Promise.resolve({
        json: async () => ({ ok: true, data: mockExperienceGuide }),
      } as Response);
    }

    if (url.includes('/chat') && init?.method === 'POST') {
      return Promise.resolve(createMockChatResponse(chatResponse));
    }

    return Promise.reject(new Error(`Fetch não mockado: ${url}`));
  });
}
