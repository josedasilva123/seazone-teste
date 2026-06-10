import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WifiCard } from '.';

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

describe('WifiCard', () => {
  it('renderiza o nome da rede e a senha', () => {
    render(<WifiCard network="SeazoneGuest" password="12345678" />);
    expect(screen.getByText('SeazoneGuest')).toBeInTheDocument();
    expect(screen.getByText('12345678')).toBeInTheDocument();
  });

  it('exibe botão de copiar', () => {
    render(<WifiCard network="Net" password="pass" />);
    expect(screen.getByRole('button', { name: 'Copiar senha' })).toBeInTheDocument();
  });

  it('copia senha ao clicar no botão', async () => {
    render(<WifiCard network="Net" password="abc123" />);
    await userEvent.click(screen.getByRole('button', { name: 'Copiar senha' }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('abc123');
    expect(screen.getByText('Copiado')).toBeInTheDocument();
  });
});
