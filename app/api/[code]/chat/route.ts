import OpenAI from 'openai';
import { GuideRepository } from '@/lib/repositories/guide';
import { PropertyRepository } from '@/lib/repositories/property';
import { GuideService, ChatFallbackService } from '@/lib/services/guide';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const RESPONSE_HEADERS = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'no-cache',
  'X-Content-Type-Options': 'nosniff',
};

/** Simula streaming palavra a palavra para o fallback */
function streamFallback(text: string): ReadableStream {
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

  let messages: ChatMessage[];
  try {
    const body = await request.json() as { messages?: ChatMessage[] };
    messages = body.messages ?? [];
  } catch {
    return new Response('Corpo da requisição inválido', { status: 400 });
  }

  const [property, guide] = await Promise.all([
    PropertyRepository.findByCode(propertyCode),
    GuideRepository.findByPropertyCode(propertyCode),
  ]);

  if (!property) {
    return new Response('Imóvel não encontrado', { status: 404 });
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const systemPrompt = GuideService.buildChatContext(property, guide);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          stream: true,
          temperature: 0.3,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
        });

        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content ?? '';
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        // Fallback baseado em regras quando a IA não está disponível (quota, rede, etc.)
        const fallbackText = ChatFallbackService.isQuotaError(err)
          ? ChatFallbackService.respond(lastUserMessage, property, guide)
          : 'Desculpe, o assistente está temporariamente indisponível. Por favor, tente novamente em alguns instantes.';

        const words = fallbackText.split(/(?<=\s)/);
        for (const word of words) {
          controller.enqueue(encoder.encode(word));
          await new Promise((r) => setTimeout(r, 20));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: RESPONSE_HEADERS });
}
