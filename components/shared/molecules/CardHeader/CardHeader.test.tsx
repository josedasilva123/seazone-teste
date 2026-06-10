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

  it('renderiza como tag pill com ícone coral', () => {
    render(<CardHeader icon={<span data-testid="tag-icon">★</span>} title="WiFi" />);
    expect(screen.getByText('WiFi')).toHaveClass('rounded-full');
    expect(screen.getByText('WiFi')).toHaveClass('bg-surface');
    expect(screen.getByTestId('tag-icon').parentElement).toHaveClass('text-primary-action');
  });
});
