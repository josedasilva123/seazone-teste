import { render, screen } from '@testing-library/react';
import { PropertyCard } from '.';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const defaultProps = {
  code: 'CDJ001',
  name: 'Chalé Vista Serra',
  city: 'Campos do Jordão',
  state: 'SP',
};

describe('PropertyCard', () => {
  it('renderiza o nome e o estado do imóvel', () => {
    render(<PropertyCard {...defaultProps} />);
    expect(screen.getByText(/Chalé Vista Serra — SP/)).toBeInTheDocument();
  });

  it('renderiza o preço formatado em BRL quando fornecido', () => {
    render(<PropertyCard {...defaultProps} dailyRateFrom={162} />);
    expect(screen.getByText(/R\$\s*162,00/)).toBeInTheDocument();
  });

  it('exibe texto alternativo quando não há preço', () => {
    render(<PropertyCard {...defaultProps} />);
    expect(screen.getByText('Consulte disponibilidade')).toBeInTheDocument();
  });

  it('renderiza o link apontando para o código do imóvel', () => {
    render(<PropertyCard {...defaultProps} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/CDJ001');
  });

  it('renderiza imagem de capa com alt correto', () => {
    render(
      <PropertyCard
        {...defaultProps}
        coverImage={{ url: '/foto.jpg', alt: 'Vista da serra' }}
      />
    );
    expect(screen.getByRole('img', { name: 'Vista da serra' })).toBeInTheDocument();
  });

  it('usa alt padrão quando alt da imagem não é fornecido', () => {
    render(
      <PropertyCard {...defaultProps} coverImage={{ url: '/foto.jpg' }} />
    );
    expect(
      screen.getByRole('img', { name: /Chalé Vista Serra — Campos do Jordão\/SP/ })
    ).toBeInTheDocument();
  });

  it('exibe mensagem quando não há foto', () => {
    render(<PropertyCard {...defaultProps} />);
    expect(screen.getByText('Sem foto')).toBeInTheDocument();
  });
});
