import { render, screen } from '@testing-library/react';
import { AppHeader } from '.';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('AppHeader', () => {
  it('renderiza o logo Seazone', () => {
    render(<AppHeader />);
    expect(screen.getByRole('img', { name: 'Seazone' })).toBeInTheDocument();
  });

  it('renderiza o código da propriedade quando fornecido', () => {
    render(<AppHeader propertyCode="FLN001" />);
    expect(screen.getByText('FLN001')).toBeInTheDocument();
  });

  it('não exibe código quando não fornecido', () => {
    render(<AppHeader />);
    expect(screen.queryByText('FLN001')).not.toBeInTheDocument();
  });

  it('exibe link de atendimento', () => {
    render(<AppHeader />);
    expect(screen.getByRole('link', { name: /Atendimento/i })).toBeInTheDocument();
  });
});
