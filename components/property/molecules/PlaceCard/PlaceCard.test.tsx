import { render, screen } from '@testing-library/react';
import { PlaceCard } from '.';

describe('PlaceCard', () => {
  it('renderiza nome, distância e descrição', () => {
    render(
      <PlaceCard
        name="Restaurante Mar"
        distance="500m"
        description="Frutos do mar frescos"
      />,
    );
    expect(screen.getByText('Restaurante Mar')).toBeInTheDocument();
    expect(screen.getByText('500m')).toBeInTheDocument();
    expect(screen.getByText('Frutos do mar frescos')).toBeInTheDocument();
  });
});
