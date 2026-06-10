import { z } from 'zod';

export const CHAT_MAX_MESSAGES = 20;
export const CHAT_MAX_MESSAGE_LENGTH = 2000;

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z
    .string()
    .min(1, 'Mensagem vazia')
    .max(CHAT_MAX_MESSAGE_LENGTH, `Mensagem excede ${CHAT_MAX_MESSAGE_LENGTH} caracteres`),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1, 'Histórico de mensagens é obrigatório')
    .max(CHAT_MAX_MESSAGES, `Histórico excede ${CHAT_MAX_MESSAGES} mensagens`),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
