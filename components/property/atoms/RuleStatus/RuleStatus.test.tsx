import { render, screen } from '@testing-library/react';
import { RuleStatus } from '.';

describe('RuleStatus', () => {
  it('renderiza label quando permitido', () => {
    render(<RuleStatus allowed label="Aceita pets" />);
    expect(screen.getByText('Aceita pets')).toBeInTheDocument();
  });

  it('renderiza label quando não permitido', () => {
    render(<RuleStatus allowed={false} label="Sem festas" />);
    expect(screen.getByText('Sem festas')).toBeInTheDocument();
  });

  it('aplica cor de sucesso quando permitido', () => {
    render(<RuleStatus allowed label="Aceita pets" />);
    expect(screen.getByText('Aceita pets')).toHaveClass('text-success');
  });

  it('aplica cor de erro quando não permitido', () => {
    render(<RuleStatus allowed={false} label="Sem festas" />);
    expect(screen.getByText('Sem festas')).toHaveClass('text-danger');
  });
});
