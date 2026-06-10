import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropertyList } from '.';
import { listProperties } from '@/lib/actions/property';

vi.mock('@/lib/actions/property', () => ({
  listProperties: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// IntersectionObserver não existe no jsdom — mock como classe construtora
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
let capturedCallback: IntersectionObserverCallback | null = null;

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    capturedCallback = callback;
  }
  observe = mockObserve;
  disconnect = mockDisconnect;
  unobserve = vi.fn();
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

const makeItem = (n: number) => ({
  id: `id-${n}`,
  code: `CDJ00${n}`,
  name: `Imóvel ${n}`,
  propertyType: 'Apartamento',
  bedroomQuantity: 2,
  bathroomQuantity: 1,
  guestCapacity: 4,
  createdAt: new Date(),
  updatedAt: new Date(),
  address: { id: `a-${n}`, street: 'Rua A', number: '1', complement: null, neighborhood: 'Centro', city: 'Florianópolis', state: 'SC', postalCode: '88000-000', propertyId: `id-${n}` },
  amenities: null,
  images: [],
  rules: null,
  host: null,
});

const initialProps = {
  initialItems: [makeItem(1), makeItem(2)],
  initialPage: 1,
  initialTotalPages: 2,
  initialTotal: 14,
};

describe('PropertyList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza os itens iniciais', () => {
    render(<PropertyList {...initialProps} />);
    // O card exibe "{city} - {state}"
    expect(screen.getAllByText(/Florianópolis - SC/).length).toBeGreaterThanOrEqual(1);
  });

  it('exibe o total de imóveis com texto correto no plural', () => {
    render(<PropertyList {...initialProps} />);
    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.getByText('imóveis disponíveis')).toBeInTheDocument();
  });

  it('exibe singular quando há apenas 1 imóvel', () => {
    render(
      <PropertyList
        {...initialProps}
        initialItems={[makeItem(1)]}
        initialTotal={1}
        initialTotalPages={1}
      />,
    );
    expect(screen.getByText('imóvel disponível')).toBeInTheDocument();
  });

  it('exibe mensagem quando não há imóveis', () => {
    render(
      <PropertyList
        initialItems={[]}
        initialPage={1}
        initialTotalPages={0}
        initialTotal={0}
      />,
    );
    expect(screen.getByText('Nenhum imóvel encontrado.')).toBeInTheDocument();
  });

  it('exibe mensagem de fim de lista quando não há mais páginas', () => {
    render(
      <PropertyList
        {...initialProps}
        initialPage={2}
        initialTotalPages={2}
      />,
    );
    expect(screen.getByText(/Você viu todos/)).toBeInTheDocument();
  });

  it('registra o sentinel no IntersectionObserver', async () => {
    render(<PropertyList {...initialProps} />);
    await waitFor(() => expect(mockObserve).toHaveBeenCalled());
  });

  it('exibe erro e botão de retry quando listProperties falha', async () => {
    vi.mocked(listProperties).mockResolvedValueOnce({ ok: false, error: 'Falha' });

    render(<PropertyList {...initialProps} />);

    // Dispara o IntersectionObserver capturado
    await waitFor(() => expect(capturedCallback).not.toBeNull());
    capturedCallback!([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver);

    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
    });
  });
});
