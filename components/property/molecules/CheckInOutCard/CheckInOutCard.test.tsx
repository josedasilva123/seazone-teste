import { render, screen } from '@testing-library/react';
import { CheckInOutCard } from '.';

describe('CheckInOutCard', () => {
  it('renderiza card de check-in com horário', () => {
    render(<CheckInOutCard type="check-in" time="15h" />);
    expect(screen.getByRole('heading', { name: 'Check-in' })).toBeInTheDocument();
    expect(screen.getByText('A partir das 15h')).toBeInTheDocument();
  });

  it('renderiza card de check-out com horário', () => {
    render(<CheckInOutCard type="check-out" time="11h" />);
    expect(screen.getByRole('heading', { name: 'Check-out' })).toBeInTheDocument();
    expect(screen.getByText('Até as 11h')).toBeInTheDocument();
  });

  it('aplica fundo azul claro no ícone de check-in', () => {
    const { container } = render(<CheckInOutCard type="check-in" time="15h" />);
    expect(container.querySelector('.bg-primary-light')).toBeInTheDocument();
  });

  it('aplica fundo vermelho claro no ícone de check-out', () => {
    const { container } = render(<CheckInOutCard type="check-out" time="11h" />);
    expect(container.querySelector('.bg-danger-light')).toBeInTheDocument();
  });
});
