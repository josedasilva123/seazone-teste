import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ChatAssistant } from '.';

vi.mock('@/components/shared/molecules/TypewriterMarkdown', async () => {
  const { MarkdownContent } = await import('@/components/shared/molecules/MarkdownContent');
  return {
    TypewriterMarkdown: ({ content }: { content: string }) => (
      <MarkdownContent content={content} />
    ),
  };
});

// jsdom doesn't implement scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

function createMockStream(text: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}

function createMockResponse(text: string, isFallback = false): Response {
  return {
    ok: true,
    body: createMockStream(text),
    headers: { get: (key: string) => (key === 'X-Is-Fallback' && isFallback ? 'true' : null) },
  } as unknown as Response;
}

describe('ChatAssistant', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renderiza botão flutuante de chat', () => {
    render(<ChatAssistant code="FLN001" />);
    expect(screen.getByRole('button', { name: /Abrir assistente virtual/i })).toBeInTheDocument();
  });

  it('abre o painel de chat ao clicar no botão', async () => {
    render(<ChatAssistant code="FLN001" />);
    await userEvent.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));
    expect(screen.getByText('Assistente Virtual', { exact: true })).toBeInTheDocument();
    expect(screen.getByText(/Olá! Sou o assistente virtual/i)).toBeInTheDocument();
  });

  it('exibe perguntas sugeridas ao abrir o chat', async () => {
    render(<ChatAssistant code="FLN001" />);
    await userEvent.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));
    expect(screen.getByText('Qual a senha do WiFi?')).toBeInTheDocument();
    expect(screen.getByText('Posso trazer meu cachorro?')).toBeInTheDocument();
    expect(screen.getByText('A que horas posso fazer check-in?')).toBeInTheDocument();
    expect(screen.getByText('Que restaurantes tem perto?')).toBeInTheDocument();
  });

  it('fecha o painel ao clicar no botão de fechar', async () => {
    render(<ChatAssistant code="FLN001" />);
    await userEvent.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));
    expect(screen.getByText('Assistente Virtual', { exact: true })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Fechar chat/i }));
    expect(screen.queryByText('Assistente Virtual', { exact: true })).not.toBeInTheDocument();
  });

  it('envia mensagem e exibe resposta em streaming', async () => {
    vi.mocked(fetch).mockResolvedValue(
      createMockResponse('A rede é SeaHome_FLN001 e a senha é floripa2024.'),
    );

    render(<ChatAssistant code="FLN001" />);
    await userEvent.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));

    const input = screen.getByPlaceholderText(/Digite sua pergunta/i);
    await userEvent.type(input, 'Qual a senha do WiFi?');
    await userEvent.click(screen.getByRole('button', { name: /Enviar mensagem/i }));

    expect(screen.getByText('Qual a senha do WiFi?')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/floripa2024/i)).toBeInTheDocument();
    });
  });

  it('envia mensagem ao clicar em pergunta sugerida', async () => {
    vi.mocked(fetch).mockResolvedValue(
      createMockResponse('Infelizmente este imóvel não permite animais de estimação.'),
    );

    render(<ChatAssistant code="FLN001" />);
    await userEvent.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));
    await userEvent.click(screen.getByText('Posso trazer meu cachorro?'));

    expect(screen.getByText('Posso trazer meu cachorro?')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/não permite animais/i)).toBeInTheDocument();
    });
  });

  it('desabilita o botão de envio quando input está vazio', async () => {
    render(<ChatAssistant code="FLN001" />);
    await userEvent.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));

    const sendButton = screen.getByRole('button', { name: /Enviar mensagem/i });
    expect(sendButton).toBeDisabled();
  });

  it('chama a API com o código correto', async () => {
    vi.mocked(fetch).mockResolvedValue(createMockResponse('Resposta do assistente.'));

    render(<ChatAssistant code="GRM001" />);
    await userEvent.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));

    const input = screen.getByPlaceholderText(/Digite sua pergunta/i);
    await userEvent.type(input, 'Olá');
    await userEvent.click(screen.getByRole('button', { name: /Enviar mensagem/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/GRM001/chat',
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  it('esconde sugestões após resposta normal da IA', async () => {
    vi.mocked(fetch).mockResolvedValue(createMockResponse('O check-in é a partir das 15h.'));

    render(<ChatAssistant code="FLN001" />);
    await userEvent.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));

    expect(screen.getByText('Qual a senha do WiFi?')).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Digite sua pergunta/i);
    await userEvent.type(input, 'A que horas posso fazer check-in?');
    await userEvent.click(screen.getByRole('button', { name: /Enviar mensagem/i }));

    await waitFor(() => {
      expect(screen.getByText(/check-in é a partir das 15h/i)).toBeInTheDocument();
    });

    expect(screen.queryByText('Qual a senha do WiFi?')).not.toBeInTheDocument();
  });

  it('exibe sugestões novamente quando recebe resposta de fallback do servidor', async () => {
    vi.mocked(fetch).mockResolvedValue(
      createMockResponse('Não tenho informações suficientes para responder a essa pergunta.', true),
    );

    render(<ChatAssistant code="FLN001" />);
    await userEvent.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));

    const input = screen.getByPlaceholderText(/Digite sua pergunta/i);
    await userEvent.type(input, 'Qual o código do cofre?');
    await userEvent.click(screen.getByRole('button', { name: /Enviar mensagem/i }));

    await waitFor(() => {
      expect(screen.getByText(/Não tenho informações suficientes/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Qual a senha do WiFi?')).toBeInTheDocument();
    expect(screen.getByText('Posso trazer meu cachorro?')).toBeInTheDocument();
  });

  it('renderiza markdown nas respostas do assistente', async () => {
    vi.mocked(fetch).mockResolvedValue(
      createMockResponse(
        '* **Capivari (Aprox. 500 metros):** O centro da cidade.\n* **Baden Baden (Aprox. 600 metros):** Cervejaria artesanal.',
      ),
    );

    render(<ChatAssistant code="GRM001" />);
    await userEvent.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));

    const input = screen.getByPlaceholderText(/Digite sua pergunta/i);
    await userEvent.type(input, 'O que tem perto?');
    await userEvent.click(screen.getByRole('button', { name: /Enviar mensagem/i }));

    await waitFor(() => {
      const bold = screen.getByText(/Capivari \(Aprox\. 500 metros\):/);
      expect(bold.tagName).toBe('STRONG');
    });

    expect(screen.getAllByTestId('markdown-content').length).toBeGreaterThanOrEqual(2);

    expect(screen.queryByText(/\*\*Capivari/)).not.toBeInTheDocument();
  });

  it('renderiza código inline nas respostas do assistente', async () => {
    vi.mocked(fetch).mockResolvedValue(
      createMockResponse('A senha do WiFi é `paraty2024`.'),
    );

    render(<ChatAssistant code="FLN001" />);
    await userEvent.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));
    await userEvent.click(screen.getByText('Qual a senha do WiFi?'));

    await waitFor(() => {
      const code = screen.getByText('paraty2024');
      expect(code.tagName).toBe('CODE');
    });
  });

  it('exibe sugestões novamente quando ocorre erro de rede', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    render(<ChatAssistant code="FLN001" />);
    await userEvent.click(screen.getByRole('button', { name: /Abrir assistente virtual/i }));

    const input = screen.getByPlaceholderText(/Digite sua pergunta/i);
    await userEvent.type(input, 'Pergunta qualquer');
    await userEvent.click(screen.getByRole('button', { name: /Enviar mensagem/i }));

    await waitFor(() => {
      expect(screen.getByText(/ocorreu um erro/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Qual a senha do WiFi?')).toBeInTheDocument();
    expect(screen.getByText('Posso trazer meu cachorro?')).toBeInTheDocument();
  });
});
