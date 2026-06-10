import { render, screen } from '@testing-library/react';
import { StayRulesSection } from '.';

const defaultProps = {
  checkInTime: '15h',
  checkOutTime: '11h',
  allowPet: false,
  smokingPermitted: false,
  suitableForChildren: true,
  suitableForBabies: true,
  eventsPermitted: false,
};

describe('StayRulesSection', () => {
  it('renderiza título da seção', () => {
    render(<StayRulesSection {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Regras da Estadia' })).toBeInTheDocument();
  });

  it('renderiza horário de check-in', () => {
    render(<StayRulesSection {...defaultProps} />);
    expect(screen.getByText('A partir das 15h')).toBeInTheDocument();
  });

  it('renderiza horário de check-out', () => {
    render(<StayRulesSection {...defaultProps} />);
    expect(screen.getByText('Até as 11h')).toBeInTheDocument();
  });

  it('renderiza todas as políticas', () => {
    render(<StayRulesSection {...defaultProps} />);
    expect(screen.getByText('Não aceita animais')).toBeInTheDocument();
    expect(screen.getByText('Proibido fumar')).toBeInTheDocument();
    expect(screen.getByText('Adequado para crianças')).toBeInTheDocument();
    expect(screen.getByText('Eventos e festas proibidos')).toBeInTheDocument();
  });
});
