import { render } from '@testing-library/react';
import { AmenityIcon } from '.';

describe('AmenityIcon', () => {
  it('renderiza sem erros para todas as amenidades suportadas', () => {
    const amenities = [
      'wifi', 'tv', 'airConditioning', 'kitchen', 'washingMachine',
      'elevator', 'balcony', 'bbqGrill', 'dishwasher', 'jacuzzi', 'pool',
    ] as const;

    for (const amenity of amenities) {
      const { container } = render(<AmenityIcon amenity={amenity} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    }
  });
});
