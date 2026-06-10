import { render, screen } from '@testing-library/react';
import { MdChecklist } from 'react-icons/md';
import { SectionTitle } from '.';

describe('SectionTitle', () => {
  it('renderiza o título com ícone', () => {
    render(<SectionTitle icon={<MdChecklist size={22} />} title="Amenidades" />);
    expect(screen.getByRole('heading', { name: 'Amenidades' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Amenidades' })).toHaveClass('text-primary-action');
  });

  it('renderiza subtítulo quando fornecido', () => {
    render(
      <SectionTitle
        icon={<MdChecklist size={22} />}
        title="Regras"
        subtitle="Para uma boa convivência"
      />,
    );
    expect(screen.getByText('Para uma boa convivência')).toBeInTheDocument();
  });

  it('não renderiza subtítulo quando não fornecido', () => {
    const { container } = render(
      <SectionTitle icon={<MdChecklist size={22} />} title="Regras" />,
    );
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });

  it('aplica fundo coral claro no container do ícone', () => {
    const { container } = render(
      <SectionTitle icon={<MdChecklist size={22} data-testid="icon" />} title="Amenidades" />,
    );
    expect(container.querySelector('.bg-primary-action-light')).toBeInTheDocument();
  });
});
