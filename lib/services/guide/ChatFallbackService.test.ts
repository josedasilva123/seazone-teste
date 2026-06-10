import { describe, it, expect } from 'vitest';
import { ChatFallbackService } from './ChatFallbackService';

const mockProperty = {
  id: 'prop-1',
  code: 'FLN001',
  name: 'Apartamento Florianópolis',
  propertyType: 'Apartamento',
  bedroomQuantity: 2,
  bathroomQuantity: 1,
  guestCapacity: 4,
  createdAt: new Date(),
  updatedAt: new Date(),
  operational: {
    id: 'op-1',
    propertyId: 'prop-1',
    wifiNetwork: 'SeaHome_FLN001',
    wifiPassword: 'floripa2024',
    isSelfCheckin: true,
    propertyAccessType: 'smart_lock',
    propertyAccessInstructions: 'Use o código 4521 na fechadura eletrônica',
    propertyPassword: '4521',
    hasParkingSpot: true,
    parkingSpotIdentifier: 'Vaga 12',
    parkingSpotInstructions: 'Portão lateral, código 7890',
  },
  rules: {
    id: 'rules-1',
    propertyId: 'prop-1',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    allowPet: false,
    smokingPermitted: false,
    suitableForChildren: true,
    suitableForBabies: true,
    eventsPermitted: false,
  },
  address: null,
  amenities: null,
  images: [],
  host: {
    id: 'host-1',
    propertyId: 'prop-1',
    name: 'Ana Paula',
    phone: '+5548991234567',
  },
  localGuide: null,
} as unknown as Parameters<typeof ChatFallbackService.respond>[1];

const mockGuide = {
  id: 'guide-1',
  welcomeMessage: 'Bem-vindo!',
  seasonalTips: 'Dica sazonal',
  aiGeneratedAt: new Date(),
  propertyId: 'prop-1',
  places: [
    {
      id: 'p1',
      name: 'Box 32',
      category: 'restaurant',
      placeType: null,
      distance: '1,2 km',
      description: 'Boteco tradicional.',
      guideId: 'guide-1',
    },
    {
      id: 'p2',
      name: 'Praia da Joaquina',
      category: 'attraction',
      placeType: null,
      distance: '18 km',
      description: 'Famosa pelas dunas.',
      guideId: 'guide-1',
    },
    {
      id: 'p3',
      name: 'Farmácia Catarinense',
      category: 'essential',
      placeType: 'pharmacy',
      distance: '300 m',
      description: 'Farmácia 24h.',
      guideId: 'guide-1',
    },
  ],
};

describe('ChatFallbackService.respond', () => {
  it('responde corretamente sobre senha do WiFi', () => {
    const answer = ChatFallbackService.respond('Qual a senha do WiFi?', mockProperty, mockGuide);
    expect(answer).toContain('SeaHome_FLN001');
    expect(answer).toContain('floripa2024');
  });

  it('responde que pets não são permitidos', () => {
    const answer = ChatFallbackService.respond('Posso trazer meu cachorro?', mockProperty, mockGuide);
    expect(answer).toContain('não permite');
  });

  it('responde o horário de check-in', () => {
    const answer = ChatFallbackService.respond('A que horas posso fazer check-in?', mockProperty, mockGuide);
    expect(answer).toContain('15:00');
  });

  it('responde o horário de check-out', () => {
    const answer = ChatFallbackService.respond('Quando devo fazer o check-out?', mockProperty, mockGuide);
    expect(answer).toContain('11:00');
  });

  it('lista restaurantes próximos', () => {
    const answer = ChatFallbackService.respond('Que restaurantes tem perto?', mockProperty, mockGuide);
    expect(answer).toContain('Box 32');
    expect(answer).toContain('1,2 km');
  });

  it('lista atrações próximas', () => {
    const answer = ChatFallbackService.respond('O que tem para visitar perto?', mockProperty, mockGuide);
    expect(answer).toContain('Praia da Joaquina');
  });

  it('lista serviços essenciais', () => {
    const answer = ChatFallbackService.respond('Tem farmácia perto?', mockProperty, mockGuide);
    expect(answer).toContain('Farmácia Catarinense');
  });

  it('informa sobre estacionamento disponível', () => {
    const answer = ChatFallbackService.respond('Tem estacionamento?', mockProperty, mockGuide);
    expect(answer).toContain('estacionamento');
    expect(answer).toContain('Vaga 12');
  });

  it('retorna resposta padrão para perguntas desconhecidas', () => {
    const answer = ChatFallbackService.respond('Qual a temperatura do sol?', mockProperty, mockGuide);
    expect(answer).toContain('anfitrião');
  });

  it('responde cordialmente a boa noite', () => {
    const answer = ChatFallbackService.respond('boa noite', mockProperty, mockGuide);
    expect(answer).toContain('Boa noite');
    expect(answer).toContain('Apartamento Florianópolis');
    expect(answer).not.toContain('Não tenho informações suficientes');
  });

  it('responde cordialmente a olá', () => {
    const answer = ChatFallbackService.respond('Olá!', mockProperty, mockGuide);
    expect(answer).toContain('Olá');
    expect(answer).toContain('WiFi');
  });

  it('responde a agradecimentos', () => {
    const answer = ChatFallbackService.respond('Obrigado pela ajuda', mockProperty, mockGuide);
    expect(answer).toContain('Por nada');
  });
});

describe('ChatFallbackService.isQuotaError', () => {
  it('detecta erro 429', () => {
    expect(ChatFallbackService.isQuotaError(new Error('429 quota exceeded'))).toBe(true);
  });

  it('detecta erro de quota excedida', () => {
    expect(ChatFallbackService.isQuotaError(new Error('insufficient_quota'))).toBe(true);
  });

  it('detecta RESOURCE_EXHAUSTED do Gemini', () => {
    expect(ChatFallbackService.isQuotaError(new Error('[GoogleGenerativeAI Error]: RESOURCE_EXHAUSTED'))).toBe(true);
  });

  it('detecta rate limit', () => {
    expect(ChatFallbackService.isQuotaError(new Error('rate limit exceeded'))).toBe(true);
  });

  it('retorna false para outros erros', () => {
    expect(ChatFallbackService.isQuotaError(new Error('network error'))).toBe(false);
  });

  it('retorna false para não-errors', () => {
    expect(ChatFallbackService.isQuotaError('string error')).toBe(false);
    expect(ChatFallbackService.isQuotaError(null)).toBe(false);
  });
});
