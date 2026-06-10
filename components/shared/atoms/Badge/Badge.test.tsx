import { render, screen } from '@testing-library/react';
import { Badge } from '.';

describe('Badge', () => {
  it('renderiza o texto corretamente', () => {
    render(<Badge>WiFi</Badge>);
    expect(screen.getByText('WiFi')).toBeInTheDocument();
  });

  it('aplica variante success', () => {
    render(<Badge variant="success">Permitido</Badge>);
    expect(screen.getByText('Permitido')).toHaveClass('bg-success-light');
  });

  it('aplica variante danger', () => {
    render(<Badge variant="danger">Proibido</Badge>);
    expect(screen.getByText('Proibido')).toHaveClass('bg-danger-light');
  });

  it('renderiza com ícone', () => {
    render(<Badge icon={<span data-testid="icon">★</span>}>Favorito</Badge>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Favorito')).toBeInTheDocument();
  });
});
