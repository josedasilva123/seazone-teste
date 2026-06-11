import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PropertyGuideTemplate } from '@/components/property/templates/PropertyGuideTemplate';
import {
  createMockChatResponse,
  mockPropertyPageFetch,
  propertyGuideTemplateProps,
} from './fixtures';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Fluxo do assistente virtual no guia do imóvel', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.stubGlobal('fetch', vi.fn());
    mockPropertyPageFetch('A rede é SeaHome_FLN001 e a senha é floripa2024.');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('mantém o guia interativo com o chat aberto', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<PropertyGuideTemplate {...propertyGuideTemplateProps} />);
    await user.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));

    expect(screen.getByText('Assistente Virtual', { exact: true })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Copiar senha' }));

    await waitFor(() => {
      expect(screen.getByText('Copiado')).toBeInTheDocument();
    });
    expect(screen.getByText('Assistente Virtual', { exact: true })).toBeInTheDocument();
  });

  it('abre o chat a partir do guia e exibe a mensagem de boas-vindas', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<PropertyGuideTemplate {...propertyGuideTemplateProps} />);

    expect(screen.getByRole('heading', { name: /Apartamento Vista Mar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Abrir assistente virtual/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));

    expect(screen.getByText('Assistente Virtual', { exact: true })).toBeInTheDocument();
    expect(screen.getByText(/Olá! Sou o assistente virtual/i)).toBeInTheDocument();
    expect(screen.getByText('Qual a senha do WiFi?')).toBeInTheDocument();
  });

  it('percorre o fluxo pergunta → streaming → resposta com efeito typewriter', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<PropertyGuideTemplate {...propertyGuideTemplateProps} />);
    await user.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));

    await user.type(screen.getByPlaceholderText(/Digite sua pergunta/i), 'Qual a senha do WiFi?');
    await user.click(screen.getByRole('button', { name: /Enviar mensagem/i }));

    expect(screen.getByText('Qual a senha do WiFi?')).toBeInTheDocument();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/FLN001/chat',
        expect.objectContaining({ method: 'POST' }),
      );
    });

    await act(async () => {
      vi.advanceTimersByTime(5_000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('typewriter-markdown')).toHaveTextContent(/A rede é SeaHome_FLN001 e a senha é floripa2024/i);
    });
  });

  it('renderiza markdown completo sem expor sintaxe durante o typewriter', async () => {
    mockPropertyPageFetch(
      '* **Capivari (Aprox. 500 metros):** O centro da cidade.\n* **Baden Baden (Aprox. 600 metros):** Cervejaria artesanal.',
    );

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<PropertyGuideTemplate {...propertyGuideTemplateProps} />);
    await user.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));

    await user.type(screen.getByPlaceholderText(/Digite sua pergunta/i), 'O que tem perto?');
    await user.click(screen.getByRole('button', { name: /Enviar mensagem/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/FLN001/chat', expect.any(Object));
    });

    await act(async () => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.queryByText(/\*\*Capivari/)).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(10_000);
    });

    await waitFor(() => {
      const bold = screen.getByText(/Capivari \(Aprox\. 500 metros\):/);
      expect(bold.tagName).toBe('STRONG');
    });

    expect(screen.queryByText(/\*\*Capivari/)).not.toBeInTheDocument();
  });

  it('reativa sugestões após resposta de fallback da API', async () => {
    vi.mocked(fetch).mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();

      if (url.includes('/guide')) {
        return Promise.resolve({
          json: async () => ({ ok: true, data: { id: 'g1', welcomeMessage: 'Oi', seasonalTips: '', aiGeneratedAt: new Date().toISOString(), places: [] } }),
        } as Response);
      }

      if (url.includes('/chat') && init?.method === 'POST') {
        return Promise.resolve(
          createMockChatResponse('Não tenho informações suficientes para responder a essa pergunta.', true),
        );
      }

      return Promise.reject(new Error(`Fetch não mockado: ${url}`));
    });

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<PropertyGuideTemplate {...propertyGuideTemplateProps} />);
    await user.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));

    await user.click(screen.getByText('Que restaurantes tem perto?'));

    await act(async () => {
      vi.advanceTimersByTime(5_000);
    });

    await waitFor(() => {
      expect(screen.getByText(/Não tenho informações suficientes/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Qual a senha do WiFi?')).toBeInTheDocument();
    expect(screen.getByText('Posso trazer meu cachorro?')).toBeInTheDocument();
  });

  it('exibe erro amigável e mantém sugestões quando a API falha', async () => {
    vi.mocked(fetch).mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();

      if (url.includes('/guide')) {
        return Promise.resolve({
          json: async () => ({ ok: true, data: { id: 'g1', welcomeMessage: 'Oi', seasonalTips: '', aiGeneratedAt: new Date().toISOString(), places: [] } }),
        } as Response);
      }

      if (url.includes('/chat')) {
        return Promise.reject(new Error('Network error'));
      }

      return Promise.reject(new Error(`Fetch não mockado: ${url}`));
    });

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<PropertyGuideTemplate {...propertyGuideTemplateProps} />);
    await user.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));

    await user.type(screen.getByPlaceholderText(/Digite sua pergunta/i), 'Pergunta qualquer');
    await user.click(screen.getByRole('button', { name: /Enviar mensagem/i }));

    await waitFor(() => {
      expect(screen.getByText(/ocorreu um erro/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Qual a senha do WiFi?')).toBeInTheDocument();
  });
});
