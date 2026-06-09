import { render, screen } from '@testing-library/react';
import { AmenityBadge } from '.';

describe('AmenityBadge', () => {
  it('renderiza o label da amenidade wifi', () => {
    render(<AmenityBadge amenity="wifi" />);
    expect(screen.getByText('WiFi')).toBeInTheDocument();
  });

  it('renderiza o label da amenidade piscina', () => {
    render(<AmenityBadge amenity="pool" />);
    expect(screen.getByText('Piscina')).toBeInTheDocument();
  });

  it('renderiza o ícone SVG', () => {
    const { container } = render(<AmenityBadge amenity="airConditioning" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
