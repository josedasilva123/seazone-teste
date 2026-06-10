import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { ChatStreamingMessage } from './ChatStreamingMessage';

describe('ChatStreamingMessage', () => {
  it('revela o texto progressivamente enquanto a rede ainda transmite', async () => {
    const onRevealComplete = vi.fn();

    const { rerender } = render(
      <ChatStreamingMessage
        content="Oi"
        isNetworkStreaming
        onRevealComplete={onRevealComplete}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Oi')).toBeInTheDocument();
    });
    expect(onRevealComplete).not.toHaveBeenCalled();
  });

  it('chama onRevealComplete e renderiza markdown ao terminar', async () => {
    const onRevealComplete = vi.fn();

    render(
      <ChatStreamingMessage
        content="A senha é `paraty2024`."
        isNetworkStreaming={false}
        onRevealComplete={onRevealComplete}
      />,
    );

    await waitFor(() => {
      expect(onRevealComplete).toHaveBeenCalledOnce();
    });

    expect(screen.getByText('paraty2024').tagName).toBe('CODE');
  });
});
