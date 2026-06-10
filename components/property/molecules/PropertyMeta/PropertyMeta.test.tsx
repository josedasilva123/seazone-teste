import { render, screen } from '@testing-library/react';
import { PropertyMeta } from '.';

describe('PropertyMeta', () => {
  it('renderiza quartos, banheiros e hóspedes', () => {
    render(<PropertyMeta bedrooms={3} bathrooms={2} maxGuests={6} />);
    expect(screen.getByText(/3 quartos/)).toBeInTheDocument();
    expect(screen.getByText(/2 banheiros/)).toBeInTheDocument();
    expect(screen.getByText(/até 6 hóspedes/)).toBeInTheDocument();
  });

  it('exibe labels descritivos', () => {
    render(<PropertyMeta bedrooms={1} bathrooms={1} maxGuests={2} />);
    expect(screen.getByText(/1 quarto$/)).toBeInTheDocument();
    expect(screen.getByText(/1 banheiro$/)).toBeInTheDocument();
    expect(screen.getByText(/até 2 hóspedes$/)).toBeInTheDocument();
  });

  it('aplica estilo inverse no tom hero', () => {
    render(
      <PropertyMeta bedrooms={2} bathrooms={1} maxGuests={4} tone="inverse" size="sm" />,
    );
    expect(screen.getByText(/2 quartos/)).toBeInTheDocument();
  });
});
