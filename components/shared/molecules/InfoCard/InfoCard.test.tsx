import { render, screen } from '@testing-library/react';
import { InfoCard } from '.';

describe('InfoCard', () => {
  it('renderiza label, value e ícone', () => {
    render(
      <InfoCard
        icon={<span data-testid="icon">🕐</span>}
        label="Check-in"
        value="A partir das 15h"
      />
    );
    expect(screen.getByText('Check-in')).toBeInTheDocument();
    expect(screen.getByText('A partir das 15h')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renderiza subvalue quando fornecido', () => {
    render(
      <InfoCard icon={<span>★</span>} label="WiFi" value="SeazoneGuest" subvalue="senha: 12345" />
    );
    expect(screen.getByText('senha: 12345')).toBeInTheDocument();
  });

  it('aplica estilo highlight quando variant=highlight', () => {
    const { container } = render(
      <InfoCard icon={<span>★</span>} label="Label" value="Valor" variant="highlight" />
    );
    expect(container.firstChild).toHaveClass('bg-primary-light');
  });
});
