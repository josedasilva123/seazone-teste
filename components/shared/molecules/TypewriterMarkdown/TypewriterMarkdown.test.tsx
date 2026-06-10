import { render, screen, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TypewriterMarkdown } from '.';

describe('TypewriterMarkdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('revela texto gradualmente', () => {
    render(<TypewriterMarkdown content="Olá!" charDelayMs={10} />);

    expect(screen.queryByText('Olá!')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(screen.getByText('Olá!')).toBeInTheDocument();
  });

  it('não exibe sintaxe markdown durante a digitação', () => {
    render(<TypewriterMarkdown content="Centro **Capivari:** cidade." charDelayMs={10} />);

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.queryByText(/\*\*Capivari/)).not.toBeInTheDocument();
    expect(screen.getByText(/Cap/)).toBeInTheDocument();
  });

  it('renderiza negrito após completar a marcação', () => {
    render(<TypewriterMarkdown content="**Capivari:** centro." charDelayMs={5} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const bold = screen.getByText('Capivari:');
    expect(bold.tagName).toBe('STRONG');
    expect(screen.queryByText('**Capivari:**')).not.toBeInTheDocument();
  });

  it('exibe cursor enquanto digita ou aguarda stream', () => {
    const { rerender } = render(
      <TypewriterMarkdown content="Oi" isStreaming charDelayMs={100} />,
    );

    expect(screen.getByTestId('typewriter-cursor')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByTestId('typewriter-cursor')).toBeInTheDocument();

    rerender(<TypewriterMarkdown content="Oi" isStreaming={false} charDelayMs={100} />);

    expect(screen.queryByTestId('typewriter-cursor')).not.toBeInTheDocument();
  });
});
