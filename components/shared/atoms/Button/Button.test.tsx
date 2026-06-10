import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '.';

describe('Button', () => {
  it('renderiza o label corretamente', () => {
    render(<Button>Confirmar</Button>);
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument();
  });

  it('chama onClick ao ser clicado', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Confirmar</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('fica desabilitado quando disabled=true', () => {
    render(<Button disabled>Confirmar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('aplica variante secondary corretamente', () => {
    render(<Button variant="secondary">Secundário</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('border-primary');
  });

  it('aplica fullWidth corretamente', () => {
    render(<Button fullWidth>Largo</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('renderiza como link quando href é fornecido', () => {
    render(<Button href="https://example.com">Link</Button>);
    expect(screen.getByRole('link', { name: 'Link' })).toHaveAttribute('href', 'https://example.com');
  });
});
