import { render, screen } from '@testing-library/react';
import { Card } from '.';

describe('Card', () => {
  it('renderiza children', () => {
    render(<Card>Conteúdo</Card>);
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });

  it('aplica padding por padrão', () => {
    const { container } = render(<Card>Conteúdo</Card>);
    expect(container.firstChild).toHaveClass('p-4');
  });

  it('remove padding quando padding=false', () => {
    const { container } = render(<Card padding={false}>Conteúdo</Card>);
    expect(container.firstChild).not.toHaveClass('p-4');
  });

  it('aplica variant highlight', () => {
    const { container } = render(<Card variant="highlight">Conteúdo</Card>);
    expect(container.firstChild).toHaveClass('bg-primary-light');
  });
});
