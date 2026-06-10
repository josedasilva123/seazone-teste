import { render, screen } from '@testing-library/react';
import { PropertyCardSkeleton, PropertyCardSkeletonGrid } from '.';

describe('PropertyCardSkeleton', () => {
  it('renderiza sem erros', () => {
    const { container } = render(<PropertyCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('PropertyCardSkeletonGrid', () => {
  it('renderiza 6 skeletons por padrão', () => {
    const { container } = render(
      <div>
        <PropertyCardSkeletonGrid />
      </div>
    );
    const skeletons = container.querySelectorAll('.animate-pulse');
    // 3 elementos animados por card (imagem + 2 linhas de texto), 6 cards
    expect(skeletons.length).toBeGreaterThanOrEqual(6);
  });

  it('renderiza a quantidade solicitada de skeletons', () => {
    render(
      <div>
        <PropertyCardSkeletonGrid count={3} />
      </div>
    );
    // 3 cards × 3 elementos = 9 elementos animate-pulse, mas ao menos 3 cards
    const { container } = render(
      <div>
        <PropertyCardSkeletonGrid count={3} />
      </div>
    );
    const items = container.querySelectorAll('.rounded-\\[--radius-xl\\]');
    expect(items).toHaveLength(3);
  });
});
