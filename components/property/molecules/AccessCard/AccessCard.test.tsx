import { render, screen } from '@testing-library/react';
import { AccessCard } from '.';

describe('AccessCard', () => {
  it('renderiza as instruções de acesso', () => {
    render(
      <AccessCard
        type="smart_lock"
        instructions="Acesse pelo aplicativo Nuki e insira o código recebido por e-mail."
      />
    );
    expect(screen.getByText(/aplicativo Nuki/)).toBeInTheDocument();
  });

  it('exibe a senha quando fornecida', () => {
    render(
      <AccessCard
        type="key_safe"
        instructions="O cofre está na entrada principal."
        password="9876"
      />
    );
    expect(screen.getByText('9876')).toBeInTheDocument();
  });

  it('exibe informações de estacionamento quando disponível', () => {
    render(
      <AccessCard
        type="physical_key"
        instructions="A chave está com o anfitrião."
        parking={{ identifier: 'Vaga 12', instructions: 'Subsolo 1' }}
      />
    );
    expect(screen.getByText('Vaga 12')).toBeInTheDocument();
    expect(screen.getByText('Subsolo 1')).toBeInTheDocument();
  });

  it('não exibe estacionamento quando não disponível', () => {
    render(<AccessCard type="smart_lock" instructions="Instruções aqui." />);
    expect(screen.queryByText('Estacionamento')).not.toBeInTheDocument();
  });
});
