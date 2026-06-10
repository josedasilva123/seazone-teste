import { render, screen } from '@testing-library/react';
import { DataField } from '.';

describe('DataField', () => {
  it('renderiza label e value', () => {
    render(<DataField label="Rede" value="SeazoneGuest" />);
    expect(screen.getByText('Rede')).toBeInTheDocument();
    expect(screen.getByText('SeazoneGuest')).toBeInTheDocument();
  });

  it('renderiza action quando boxed=true', () => {
    render(
      <DataField
        label="Senha"
        value="abc123"
        boxed
        action={<button type="button">Copiar</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Copiar' })).toBeInTheDocument();
  });
});
