import { describe, expect, it } from 'vitest';
import { CHAT_MAX_MESSAGE_LENGTH, CHAT_MAX_MESSAGES, chatRequestSchema } from './chatMessageSchema';

describe('chatRequestSchema', () => {
  it('aceita histórico válido', () => {
    const result = chatRequestSchema.safeParse({
      messages: [
        { role: 'assistant', content: 'Olá!' },
        { role: 'user', content: 'Qual o WiFi?' },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('rejeita histórico vazio', () => {
    const result = chatRequestSchema.safeParse({ messages: [] });
    expect(result.success).toBe(false);
  });

  it('rejeita role inválida', () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: 'system', content: 'hack' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejeita mensagem acima do limite de caracteres', () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: 'user', content: 'a'.repeat(CHAT_MAX_MESSAGE_LENGTH + 1) }],
    });
    expect(result.success).toBe(false);
  });

  it('rejeita histórico acima do limite de mensagens', () => {
    const messages = Array.from({ length: CHAT_MAX_MESSAGES + 1 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' as const : 'assistant' as const,
      content: `msg ${i}`,
    }));

    const result = chatRequestSchema.safeParse({ messages });
    expect(result.success).toBe(false);
  });
});
