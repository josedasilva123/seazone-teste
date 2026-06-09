import { render, screen } from '@testing-library/react';
import { PropertyGuideTemplate } from '.';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

const templateProps = {
  code: 'FLN001',
  name: 'Apartamento Vista Mar',
  propertyType: 'Apartamento',
  city: 'Florianópolis',
  state: 'SC',
  bedrooms: 2,
  bathrooms: 1,
  maxGuests: 4,
  images: [{ url: '/img.jpg', alt: 'Sala', order: 0 }],
  amenities: { wifi: true, pool: true, airConditioning: true },
  wifi: { network: 'SeazoneGuest', password: 'sea123' },
  access: { type: 'smart_lock' as const, instructions: 'Use o app.', password: '4321' },
  parking: null,
  rules: {
    checkInTime: '15h',
    checkOutTime: '11h',
    allowPet: false,
    smokingPermitted: false,
    suitableForChildren: true,
    suitableForBabies: false,
    eventsPermitted: false,
  },
  host: { name: 'Carlos', phone: '48999001122' },
  address: {
    street: 'Rua das Flores',
    number: '10',
    neighborhood: 'Centro',
    city: 'Florianópolis',
    state: 'SC',
    postalCode: '88010-000',
  },
};

describe('PropertyGuideTemplate', () => {
  it('renderiza o nome do imóvel', () => {
    render(<PropertyGuideTemplate {...templateProps} />);
    expect(screen.getByRole('heading', { name: /Apartamento Vista Mar/i })).toBeInTheDocument();
  });

  it('renderiza o código do imóvel no header', () => {
    render(<PropertyGuideTemplate {...templateProps} />);
    expect(screen.getByText('FLN001')).toBeInTheDocument();
  });

  it('renderiza todas as seções principais', () => {
    render(<PropertyGuideTemplate {...templateProps} />);
    expect(screen.getByRole('region', { name: 'Amenidades' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Informações de acesso' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Regras da estadia' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Contato e localização' })).toBeInTheDocument();
  });

  it('renderiza o footer com marca Seazone', () => {
    render(<PropertyGuideTemplate {...templateProps} />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
