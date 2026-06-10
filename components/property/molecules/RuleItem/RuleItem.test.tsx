import { render, screen } from '@testing-library/react';
import { RuleItem } from '.';

describe('RuleItem', () => {
  it('renderiza política de pet permitida', () => {
    render(<RuleItem policy="pet" allowed />);
    expect(screen.getByText('Aceita animais de estimação')).toBeInTheDocument();
  });

  it('renderiza política de pet negada', () => {
    render(<RuleItem policy="pet" allowed={false} />);
    expect(screen.getByText('Não aceita animais')).toBeInTheDocument();
  });

  it('renderiza política de eventos', () => {
    render(<RuleItem policy="events" allowed={false} />);
    expect(screen.getByText('Eventos e festas proibidos')).toBeInTheDocument();
  });

  it('renderiza política de fumar permitida', () => {
    render(<RuleItem policy="smoking" allowed />);
    expect(screen.getByText('Permitido fumar')).toBeInTheDocument();
  });
});
