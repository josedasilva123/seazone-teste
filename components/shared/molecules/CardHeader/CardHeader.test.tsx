import { render, screen } from '@testing-library/react';
import { CardHeader } from '.';

describe('CardHeader', () => {
  it('renderiza título e ícone', () => {
    render(
      <CardHeader icon={<span data-testid="icon">★</span>} title="WiFi" />,
    );
    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('aplica tom accent no ícone', () => {
    const { container } = render(
      <CardHeader icon={<span>★</span>} title="Acesso" iconTone="accent" />,
    );
    expect(container.querySelector('.bg-accent-light')).toBeInTheDocument();
  });
});
