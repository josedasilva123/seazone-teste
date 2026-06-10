import {
  GoogleGenerativeAI,
  type Content,
  type GenerateContentStreamResult,
} from '@google/generative-ai';

export const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash';

export interface GeminiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function getApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada');
  }
  return apiKey;
}

function getModelName(): string {
  return process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
}

function createModel(options?: { json?: boolean; temperature?: number }) {
  const genAI = new GoogleGenerativeAI(getApiKey());
  return genAI.getGenerativeModel({
    model: getModelName(),
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

export function isGeminiQuotaError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes('429')
    || msg.includes('quota')
    || msg.includes('rate limit')
    || msg.includes('resource_exhausted')
    || msg.includes('resource exhausted')
  );
}
