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
  it('renderiza cidade e estado no formato correto', () => {
    render(<PropertyCard {...defaultProps} />);
    expect(screen.getByText('Campos do Jordão - SP')).toBeInTheDocument();
  });

  it('renderiza o preço formatado em BRL quando fornecido', () => {
    render(<PropertyCard {...defaultProps} dailyRateFrom={162} />);
    expect(screen.getByText(/R\$\s*162,00/)).toBeInTheDocument();
  });

  it('o preço está em cor primary', () => {
    render(<PropertyCard {...defaultProps} dailyRateFrom={162} />);
    const priceEl = screen.getByText(/Diárias a partir de/);
    expect(priceEl).toHaveClass('text-primary');
  });

  it('exibe texto alternativo quando não há preço', () => {
    render(<PropertyCard {...defaultProps} />);
    expect(screen.getByText('Consulte disponibilidade')).toBeInTheDocument();
  });

  it('renderiza o link apontando para o código do imóvel', () => {
    render(<PropertyCard {...defaultProps} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/CDJ001');
  });

  it('renderiza imagem de capa com alt padrão usando cidade/estado', () => {
    render(
      <PropertyCard {...defaultProps} coverImage={{ url: '/foto.jpg' }} />
    );
    expect(screen.getByRole('img', { name: /Campos do Jordão – SP/ })).toBeInTheDocument();
  });

  it('usa alt personalizado quando fornecido', () => {
    render(
      <PropertyCard
        {...defaultProps}
        coverImage={{ url: '/foto.jpg', alt: 'Vista da varanda' }}
      />
    );
    expect(screen.getByRole('img', { name: 'Vista da varanda' })).toBeInTheDocument();
  });

  it('exibe mensagem quando não há foto', () => {
    render(<PropertyCard {...defaultProps} />);
    expect(screen.getByText('Sem foto')).toBeInTheDocument();
  });
});
