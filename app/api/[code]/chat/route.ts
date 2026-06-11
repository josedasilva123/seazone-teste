import { GuideRepository } from '@/lib/repositories/guide';
import { PropertyRepository } from '@/lib/repositories/property';
import {
  GeminiConfigError,
  detectContextLeak,
  hasInjectionInMessages,
  INJECTION_REFUSAL_MESSAGE,
  isGeminiConfigured,
  isGeminiQuotaError,
  iterateStreamText,
  logGeminiError,
  prepareChatMessagesForLlm,
  streamChatContent,
} from '@/lib/ai';
import { GuideService, ChatFallbackService } from '@/lib/services/guide';
import { chatRequestSchema } from '@/lib/validations/chat';

export const dynamic = 'force-dynamic';

const RESPONSE_HEADERS = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'no-cache',
  'X-Content-Type-Options': 'nosniff',
};

const FALLBACK_HEADERS = {
  ...RESPONSE_HEADERS,
  'X-Is-Fallback': 'true',
};

const UNAVAILABLE_MESSAGE =
  'Desculpe, o assistente está temporariamente indisponível. Por favor, tente novamente em alguns instantes.';

function streamText(text: string): ReadableStream {
  const encoder = new TextEncoder();
  const words = text.split(/(?<=\s)/);
  return new ReadableStream({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(word));
        await new Promise((r) => setTimeout(r, 20));
      }
      controller.close();
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const propertyCode = code.toUpperCase();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response('Corpo da requisição inválido', { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response('Dados da conversa inválidos', { status: 400 });
  }

  const messages = parsed.data.messages;

  const [property, guide] = await Promise.all([
    PropertyRepository.findByCode(propertyCode),
    GuideRepository.findByPropertyCode(propertyCode),
  ]);

  if (!property) {
    return new Response('Imóvel não encontrado', { status: 404 });
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

  if (hasInjectionInMessages(messages)) {
    return new Response(streamText(INJECTION_REFUSAL_MESSAGE), { headers: RESPONSE_HEADERS });
  }

  if (!isGeminiConfigured()) {
    logGeminiError('chat/config', new GeminiConfigError('GEMINI_API_KEY ausente no ambiente'));
    return new Response(UNAVAILABLE_MESSAGE, { status: 503, headers: RESPONSE_HEADERS });
  }

  const systemPrompt = GuideService.buildChatContext(property, guide);
  const llmMessages = prepareChatMessagesForLlm(messages);

  try {
    const completion = await streamChatContent(systemPrompt, llmMessages, 0.2);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let accumulated = '';
        let blocked = false;

        try {
          for await (const text of iterateStreamText(completion.stream)) {
            if (blocked) continue;

            accumulated += text;
            if (detectContextLeak(accumulated)) {
              blocked = true;
              controller.enqueue(encoder.encode(INJECTION_REFUSAL_MESSAGE));
              controller.close();
              return;
            }

            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          logGeminiError('chat/stream', err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, { headers: RESPONSE_HEADERS });
  } catch (err) {
    logGeminiError('chat/request', err);

    if (isGeminiQuotaError(err)) {
      const fallbackText = ChatFallbackService.respond(lastUserMessage, property, guide);
      return new Response(streamText(fallbackText), { headers: FALLBACK_HEADERS });
    }

    return new Response(
      streamText(UNAVAILABLE_MESSAGE),
      { status: 503, headers: RESPONSE_HEADERS },
    );
  }
}
