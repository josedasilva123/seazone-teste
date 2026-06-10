import { render, screen } from '@testing-library/react';
import { Logo } from '.';

describe('Logo', () => {
  it('renderiza a imagem do logo com alt text', () => {
    render(<Logo />);
    expect(screen.getByRole('img', { name: 'Seazone' })).toBeInTheDocument();
  });

  it('aplica classe de tamanho sm', () => {
    render(<Logo size="sm" />);
    expect(screen.getByRole('img', { name: 'Seazone' })).toHaveClass('h-4');
  });

  it('aplica classe de tamanho lg', () => {
    render(<Logo size="lg" />);
    expect(screen.getByRole('img', { name: 'Seazone' })).toHaveClass('h-6');
  });
});
