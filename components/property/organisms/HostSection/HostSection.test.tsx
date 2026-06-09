import { render, screen } from '@testing-library/react';
import { HostSection } from '.';

describe('HostSection', () => {
  it('renderiza título da seção', () => {
    render(<HostSection host={{ name: 'Maria', phone: '48911223344' }} />);
    expect(screen.getByRole('heading', { name: 'Contato & Localização' })).toBeInTheDocument();
  });

  it('renderiza nome do anfitrião', () => {
    render(<HostSection host={{ name: 'Maria', phone: '48911223344' }} />);
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });

  it('renderiza endereço quando fornecido', () => {
    render(
      <HostSection
        host={{ name: 'Maria', phone: '48911223344' }}
        address={{
          street: 'Av. Beira Mar',
          number: '500',
          neighborhood: 'Centro',
          city: 'Florianópolis',
          state: 'SC',
          postalCode: '88010-100',
        }}
      />
    );
    expect(screen.getByText(/Av. Beira Mar/)).toBeInTheDocument();
  });
});
