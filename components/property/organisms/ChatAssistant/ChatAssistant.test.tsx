import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ChatAssistant } from '.';

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
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      body: createMockStream('A rede é SeaHome_FLN001 e a senha é floripa2024.'),
    } as Response);

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
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      body: createMockStream('Infelizmente este imóvel não permite animais de estimação.'),
    } as Response);

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
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      body: createMockStream('Resposta do assistente.'),
    } as Response);

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
});
