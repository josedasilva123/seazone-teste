import { render, screen } from '@testing-library/react';
import { PropertyMeta } from '.';

describe('PropertyMeta', () => {
  it('renderiza quartos, banheiros e hóspedes', () => {
    render(<PropertyMeta bedrooms={3} bathrooms={2} maxGuests={6} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('exibe labels descritivos', () => {
    render(<PropertyMeta bedrooms={1} bathrooms={1} maxGuests={2} />);
    expect(screen.getByText('quarto(s)')).toBeInTheDocument();
    expect(screen.getByText('banheiro(s)')).toBeInTheDocument();
    expect(screen.getByText('hóspede(s)')).toBeInTheDocument();
  });
});
