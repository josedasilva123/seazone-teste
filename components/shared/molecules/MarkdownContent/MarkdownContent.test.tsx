import { render, screen } from '@testing-library/react';
import { MarkdownContent } from '.';

describe('MarkdownContent', () => {
  it('renderiza texto simples', () => {
    render(<MarkdownContent content="Olá, visitante!" />);
    expect(screen.getByText('Olá, visitante!')).toBeInTheDocument();
  });

  it('renderiza negrito', () => {
    render(<MarkdownContent content="**Capivari:** centro da cidade" />);
    const bold = screen.getByText('Capivari:');
    expect(bold.tagName).toBe('STRONG');
  });

  it('renderiza lista com itens em negrito', () => {
    render(
      <MarkdownContent content="* **Capivari (Aprox. 500 metros):** O centro da cidade.\n* **Baden Baden (Aprox. 600 metros):** Cervejaria artesanal." />,
    );
    expect(screen.getByText(/Capivari \(Aprox\. 500 metros\):/)).toBeInTheDocument();
    expect(screen.getByText(/Baden Baden \(Aprox\. 600 metros\):/)).toBeInTheDocument();
    expect(screen.getByText(/O centro da cidade/)).toBeInTheDocument();
  });

  it('renderiza links', () => {
    render(<MarkdownContent content="Visite [o site](https://seazone.com.br)" />);
    const link = screen.getByRole('link', { name: 'o site' });
    expect(link).toHaveAttribute('href', 'https://seazone.com.br');
  });
});
