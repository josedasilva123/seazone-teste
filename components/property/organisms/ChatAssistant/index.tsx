'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MdChat, MdClose, MdSend, MdSmartToy } from 'react-icons/md';
import { Button } from '@/components/shared/atoms';
import { MarkdownContent } from '@/components/shared/molecules/MarkdownContent';
import { TypewriterMarkdown } from '@/components/shared/molecules/TypewriterMarkdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  animate?: boolean;
}

interface ChatAssistantProps {
  code: string;
}

const SUGGESTED_QUESTIONS = [
  'Qual a senha do WiFi?',
  'Posso trazer meu cachorro?',
  'A que horas posso fazer check-in?',
  'Que restaurantes tem perto?',
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

export function ChatAssistant({ code }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Olá! Sou o assistente virtual deste imóvel. Como posso ajudar?',
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);
    setShowSuggestions(false);

    const assistantMessage: Message = { role: 'assistant', content: '', animate: true };
    setMessages([...newMessages, assistantMessage]);

    abortRef.current = new AbortController();

    try {
      const response = await fetch(`/api/${code}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
        signal: abortRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error('Erro na resposta do servidor');
      }

      const isFallback = response.headers.get('X-Is-Fallback') === 'true';

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role !== 'assistant') return prev;
          return [
            ...prev.slice(0, -1),
            { ...last, content: last.content + chunk },
          ];
        });
      }

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && !last.content.trim()) {
          setIsStreaming(false);
        }
        return prev;
      });

      if (isFallback) setShowSuggestions(true);
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setIsStreaming(false);
        return;
      }
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role !== 'assistant') return prev;
        return [
          ...prev.slice(0, -1),
          { ...last, content: last.content || 'Desculpe, ocorreu um erro. Tente novamente.' },
        ];
      });
      setShowSuggestions(true);
      setIsStreaming(false);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleClose() {
    abortRef.current?.abort();
    setIsOpen(false);
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        aria-label="Abrir assistente virtual"
        className={[
          'fixed bottom-6 right-6 z-50 rounded-full shadow-lg',
          isOpen ? 'hidden' : 'inline-flex',
        ].join(' ')}
      >
        <MdChat size={20} />
        <span>Assistente</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-end sm:justify-end sm:p-6">
          <div
            className="absolute inset-0 bg-black/40 sm:hidden"
            onClick={handleClose}
            aria-hidden
          />

          <div className="relative z-10 w-full sm:w-96 flex flex-col bg-surface rounded-t-[--radius-xl] sm:rounded-[--radius-xl] shadow-lg border border-border overflow-hidden"
            style={{ height: 'min(560px, 85dvh)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MdSmartToy size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">Assistente Virtual</p>
                  <p className="text-[10px] text-white/70 leading-tight">Seazone · {code}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                aria-label="Fechar chat"
                className="w-8 h-8 p-0 rounded-full text-white hover:bg-white/15 hover:text-white"
              >
                <MdClose size={18} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 overscroll-contain">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={['flex', msg.role === 'user' ? 'justify-end' : 'justify-start'].join(' ')}
                >
                  <div
                    className={[
                      'max-w-[82%] rounded-[--radius-lg] px-3 py-2 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-surface-secondary text-text-body rounded-bl-sm border border-border',
                    ].join(' ')}
                  >
                    {msg.content ? (
                      msg.role === 'assistant' ? (
                        msg.animate && i === messages.length - 1 ? (
                          <TypewriterMarkdown
                            content={msg.content}
                            isStreaming={isStreaming}
                          />
                        ) : (
                          <MarkdownContent content={msg.content} />
                        )
                      ) : (
                        msg.content
                      )
                    ) : msg.role === 'assistant' && isStreaming && i === messages.length - 1 ? (
                      <TypingIndicator />
                    ) : null}
                  </div>
                </div>
              ))}

              {(messages.length <= 1 || showSuggestions) && (
                <div className="flex flex-col gap-2 pt-1">
                  <p className="text-xs text-text-muted text-center">Perguntas sugeridas:</p>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <Button
                      key={q}
                      variant="secondary"
                      size="sm"
                      onClick={() => sendMessage(q)}
                      disabled={isStreaming}
                      className="justify-start text-left font-normal"
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-3 border-t border-border bg-surface shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua pergunta..."
                disabled={isStreaming}
                className="flex-1 text-sm px-3 py-2 rounded-[--radius-md] border border-border bg-surface-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-60 text-text-body placeholder:text-text-muted"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isStreaming}
                aria-label="Enviar mensagem"
                className="w-9 h-9 p-0 shrink-0"
              >
                <MdSend size={16} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
