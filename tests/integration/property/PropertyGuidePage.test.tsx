import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import PropertyGuidePage from '@/app/[code]/page';

vi.mock('@/lib/actions/property', () => ({
  getPropertyByCode: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => { throw new Error('NEXT_NOT_FOUND'); }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

import { getPropertyByCode } from '@/lib/actions/property';

const mockProperty = {
  id: 'prop-1',
  code: 'FLN001',
  name: 'Apartamento Beira-Mar Florianópolis',
  propertyType: 'Apartamento',
  bedroomQuantity: 2,
  bathroomQuantity: 1,
  guestCapacity: 4,
  createdAt: new Date(),
  updatedAt: new Date(),
  address: {
    id: 'addr-1',
    propertyId: 'prop-1',
    street: 'Rua Lauro Linhares',
    number: '589',
    complement: 'Apto 301',
    neighborhood: 'Trindade',
    city: 'Florianópolis',
    state: 'SC',
    postalCode: '88036-001',
  },
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
    parkingSpotInstructions: 'Portão lateral',
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
  amenities: {
    id: 'am-1',
    propertyId: 'prop-1',
    wifi: true,
    tv: true,
    airConditioning: true,
    kitchen: true,
    washingMachine: false,
    elevator: true,
    balcony: true,
    bbqGrill: false,
    dishwasher: false,
    jacuzzi: false,
    pool: false,
  },
  images: [
    { id: 'img-1', propertyId: 'prop-1', url: 'https://example.com/img.jpg', alt: 'Sala', order: 0 },
  ],
  host: {
    id: 'host-1',
    propertyId: 'prop-1',
    name: 'Ana Paula',
    phone: '+5548991234567',
  },
  localGuide: null,
};

describe('PropertyGuidePage — integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza o guia completo quando o imóvel existe', async () => {
    vi.mocked(getPropertyByCode).mockResolvedValue({ ok: true, data: mockProperty });

    const ui = await PropertyGuidePage({ params: Promise.resolve({ code: 'FLN001' }) });
    render(ui);

    expect(screen.getByRole('heading', { name: /Apartamento Beira-Mar Florianópolis/i })).toBeInTheDocument();
    expect(screen.getByText('FLN001')).toBeInTheDocument();
    expect(screen.getByText('Florianópolis, SC')).toBeInTheDocument();
  });

  it('exibe informações de WiFi corretamente', async () => {
    vi.mocked(getPropertyByCode).mockResolvedValue({ ok: true, data: mockProperty });

    const ui = await PropertyGuidePage({ params: Promise.resolve({ code: 'FLN001' }) });
    render(ui);

    expect(screen.getByText('SeaHome_FLN001')).toBeInTheDocument();
    expect(screen.getByText('floripa2024')).toBeInTheDocument();
  });

  it('exibe informações de acesso e estacionamento', async () => {
    vi.mocked(getPropertyByCode).mockResolvedValue({ ok: true, data: mockProperty });

    const ui = await PropertyGuidePage({ params: Promise.resolve({ code: 'FLN001' }) });
    render(ui);

    expect(screen.getByText(/Use o código 4521/i)).toBeInTheDocument();
    expect(screen.getByText(/Vaga 12/i)).toBeInTheDocument();
  });

  it('exibe regras de estadia com check-in e check-out', async () => {
    vi.mocked(getPropertyByCode).mockResolvedValue({ ok: true, data: mockProperty });

    const ui = await PropertyGuidePage({ params: Promise.resolve({ code: 'FLN001' }) });
    render(ui);

    // Aparece na strip de referência rápida E na seção de regras
    expect(screen.getAllByText(/A partir das 15:00/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Até as 11:00/i).length).toBeGreaterThanOrEqual(1);
  });

  it('exibe nome e telefone do anfitrião', async () => {
    vi.mocked(getPropertyByCode).mockResolvedValue({ ok: true, data: mockProperty });

    const ui = await PropertyGuidePage({ params: Promise.resolve({ code: 'FLN001' }) });
    render(ui);

    expect(screen.getByText('Ana Paula')).toBeInTheDocument();
  });

  it('chama notFound quando o imóvel não existe', async () => {
    vi.mocked(getPropertyByCode).mockResolvedValue({ ok: false, error: 'Imóvel não encontrado' });

    await expect(
      PropertyGuidePage({ params: Promise.resolve({ code: 'INVALIDO' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('converte o código para maiúsculas antes de buscar', async () => {
    vi.mocked(getPropertyByCode).mockResolvedValue({ ok: true, data: mockProperty });

    await PropertyGuidePage({ params: Promise.resolve({ code: 'fln001' }) });

    expect(getPropertyByCode).toHaveBeenCalledWith('FLN001');
  });
});
