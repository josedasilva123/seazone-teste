import { render, screen } from '@testing-library/react';
import { CheckInOutStrip } from '.';

describe('CheckInOutStrip', () => {
  it('renderiza horários de check-in e check-out', () => {
    render(<CheckInOutStrip checkInTime="15h" checkOutTime="11h" />);
    expect(screen.getByText('A partir das 15h')).toBeInTheDocument();
    expect(screen.getByText('Até as 11h')).toBeInTheDocument();
  });
});
