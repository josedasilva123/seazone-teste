import { render, screen } from '@testing-library/react';
import { AccessSection } from '.';

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

describe('AccessSection', () => {
  const defaultProps = {
    wifi: { network: 'SeazoneGuest5G', password: 'sea@2024' },
    access: {
      type: 'smart_lock' as const,
      instructions: 'Baixe o app e use o código.',
      password: '1234',
    },
  };

  it('renderiza título da seção', () => {
    render(<AccessSection {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Acesso ao Imóvel' })).toBeInTheDocument();
  });

  it('renderiza dados de WiFi', () => {
    render(<AccessSection {...defaultProps} />);
    expect(screen.getByText('SeazoneGuest5G')).toBeInTheDocument();
    expect(screen.getByText('sea@2024')).toBeInTheDocument();
  });

  it('renderiza instruções de acesso', () => {
    render(<AccessSection {...defaultProps} />);
    expect(screen.getByText(/Baixe o app/)).toBeInTheDocument();
  });
});
