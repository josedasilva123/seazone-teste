import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropertyHero } from '.';

const baseProps = {
  name: 'Apartamento Seazone Florianópolis',
  propertyType: 'Apartamento',
  city: 'Florianópolis',
  state: 'SC',
  bedrooms: 2,
  bathrooms: 1,
  maxGuests: 4,
  images: [
    { url: '/img1.jpg', alt: 'Sala', order: 0 },
    { url: '/img2.jpg', alt: 'Quarto', order: 1 },
  ],
};

describe('PropertyHero', () => {
  it('renderiza o nome da propriedade', () => {
    render(<PropertyHero {...baseProps} />);
    expect(screen.getByRole('heading', { name: /Apartamento Seazone/i })).toBeInTheDocument();
  });

  it('renderiza cidade e estado', () => {
    render(<PropertyHero {...baseProps} />);
    expect(screen.getByText('Florianópolis, SC')).toBeInTheDocument();
  });

  it('renderiza metadados do imóvel', () => {
    render(<PropertyHero {...baseProps} />);
    expect(screen.getByText(/2 quartos/)).toBeInTheDocument();
  });

  it('navega para próxima foto ao clicar em avançar', async () => {
    render(<PropertyHero {...baseProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Próxima foto' }));
    expect(screen.getByRole('button', { name: 'Foto 2' })).toHaveClass('scale-125');
  });

  it('exibe mensagem quando não há fotos', () => {
    render(<PropertyHero {...baseProps} images={[]} />);
    expect(screen.getByText('Sem fotos disponíveis')).toBeInTheDocument();
  });
});
