import { render, screen } from '@testing-library/react';
import { AmenitiesSection } from '.';

describe('AmenitiesSection', () => {
  it('renderiza amenidades disponíveis', () => {
    render(<AmenitiesSection amenities={{ wifi: true, pool: true, tv: false }} />);
    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('Piscina')).toBeInTheDocument();
    expect(screen.queryByText('TV')).not.toBeInTheDocument();
  });

  it('não renderiza quando não há amenidades disponíveis', () => {
    const { container } = render(
      <AmenitiesSection amenities={{ wifi: false, pool: false }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza o título da seção', () => {
    render(<AmenitiesSection amenities={{ wifi: true }} />);
    expect(screen.getByRole('heading', { name: 'Amenidades' })).toBeInTheDocument();
  });
});
