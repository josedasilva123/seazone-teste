import {
  GoogleGenerativeAI,
  type Content,
  type GenerateContentStreamResult,
} from '@google/generative-ai';

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

export interface GeminiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class GeminiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiConfigError';
  }
}

export function getGeminiApiKey(): string | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  return apiKey || null;
}

export function isGeminiConfigured(): boolean {
  return getGeminiApiKey() !== null;
}

export function getGeminiModelName(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

function assertGeminiConfigured(): string {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new GeminiConfigError('GEMINI_API_KEY não configurada');
  }
  return apiKey;
}

function createModel(options?: { json?: boolean; temperature?: number }) {
  const genAI = new GoogleGenerativeAI(assertGeminiConfigured());
  return genAI.getGenerativeModel({
    model: getGeminiModelName(),
    generationConfig: {
      temperature: options?.temperature,
      ...(options?.json ? { responseMimeType: 'application/json' as const } : {}),
    },
  });
}

function toGeminiContents(messages: GeminiChatMessage[]): Content[] {
  return messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }));
}

export function extractGeminiErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export function isGeminiAuthError(err: unknown): boolean {
  const msg = extractGeminiErrorMessage(err).toLowerCase();
  return (
    msg.includes('api key not valid')
    || msg.includes('api_key_invalid')
    || msg.includes('permission denied')
    || msg.includes('unauthenticated')
    || msg.includes('[401')
    || msg.includes('[403')
    || msg.includes(' 401 ')
    || msg.includes(' 403 ')
  );
}

export function isGeminiQuotaError(err: unknown): boolean {
  if (err instanceof GeminiConfigError || isGeminiAuthError(err)) return false;

  const msg = extractGeminiErrorMessage(err).toLowerCase();
  return (
    msg.includes('429')
    || msg.includes('resource_exhausted')
    || msg.includes('resource exhausted')
    || msg.includes('rate limit')
    || msg.includes('rate_limit')
    || msg.includes('too many requests')
    || msg.includes('quota exceeded')
    || msg.includes('exceeded your current quota')
    || msg.includes('insufficient_quota')
  );
}

export function logGeminiError(context: string, err: unknown): void {
  const message = extractGeminiErrorMessage(err);
  console.error(`[gemini/${context}]`, {
    message,
    model: getGeminiModelName(),
    configured: isGeminiConfigured(),
    quota: isGeminiQuotaError(err),
    auth: isGeminiAuthError(err),
    config: err instanceof GeminiConfigError,
  });
}

export async function generateJsonContent(
  systemPrompt: string,
  userPrompt: string,
  temperature = 0.7,
): Promise<string> {
  const model = createModel({ json: true, temperature });
  const result = await model.generateContent({
    systemInstruction: systemPrompt,
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
  });

  return result.response.text();
}

export async function streamChatContent(
  systemPrompt: string,
  messages: GeminiChatMessage[],
  temperature = 0.3,
): Promise<GenerateContentStreamResult> {
  const model = createModel({ temperature });
  return model.generateContentStream({
    systemInstruction: systemPrompt,
    contents: toGeminiContents(messages),
  });
}

export async function* iterateStreamText(
  stream: AsyncGenerator<{ text: () => string }>,
): AsyncGenerator<string> {
  for await (const chunk of stream) {
    try {
      const text = chunk.text();
      if (text) yield text;
    } catch {
      // chunk sem conteúdo textual
    }
  }
}
