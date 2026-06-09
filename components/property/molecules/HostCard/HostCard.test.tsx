import { render, screen } from '@testing-library/react';
import { HostCard } from '.';

describe('HostCard', () => {
  const defaultProps = {
    name: 'Carlos Anfitrião',
    phone: '48999887766',
  };

  it('renderiza o nome do anfitrião', () => {
    render(<HostCard {...defaultProps} />);
    expect(screen.getByText('Carlos Anfitrião')).toBeInTheDocument();
  });

  it('renderiza o telefone formatado', () => {
    render(<HostCard {...defaultProps} />);
    expect(screen.getByText('(48) 99988-7766')).toBeInTheDocument();
  });

  it('exibe a inicial do nome no avatar', () => {
    render(<HostCard {...defaultProps} />);
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('renderiza endereço quando fornecido', () => {
    render(
      <HostCard
        {...defaultProps}
        address={{
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Florianópolis',
          state: 'SC',
          postalCode: '88010-000',
        }}
      />
    );
    expect(screen.getByText(/Rua das Flores/)).toBeInTheDocument();
    expect(screen.getByText(/Florianópolis/)).toBeInTheDocument();
  });

  it('gera link de WhatsApp correto', () => {
    render(<HostCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://wa.me/5548999887766');
  });
});
