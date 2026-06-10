import { render, screen } from '@testing-library/react';
import { Divider } from '.';

describe('Divider', () => {
  it('renderiza sem label como linha horizontal', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renderiza com label exibindo o texto', () => {
    render(<Divider label="Ou" />);
    expect(screen.getByText('Ou')).toBeInTheDocument();
  });
});
