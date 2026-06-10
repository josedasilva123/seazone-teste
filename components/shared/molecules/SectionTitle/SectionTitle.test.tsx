import { render, screen } from '@testing-library/react';
import { SectionTitle } from '.';

describe('SectionTitle', () => {
  it('renderiza o título', () => {
    render(<SectionTitle title="Amenidades" />);
    expect(screen.getByRole('heading', { name: 'Amenidades' })).toBeInTheDocument();
  });

  it('renderiza subtítulo quando fornecido', () => {
    render(<SectionTitle title="Regras" subtitle="Para uma boa convivência" />);
    expect(screen.getByText('Para uma boa convivência')).toBeInTheDocument();
  });

  it('não renderiza subtítulo quando não fornecido', () => {
    const { container } = render(<SectionTitle title="Regras" />);
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });
});
