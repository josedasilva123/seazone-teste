import OpenAI from 'openai';
import { GuideRepository } from '@/lib/repositories/guide';
import type { GuideWithPlaces } from '@/lib/repositories/guide';
import { PropertyRepository } from '@/lib/repositories/property';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const GUIDE_SYSTEM_PROMPT = `Você é um especialista em turismo e gastronomia brasileiro. 
Gere um guia local preciso e contextualizado para hóspedes de uma propriedade de temporada.
Responda APENAS com JSON válido, sem markdown, sem texto adicional.`;

interface RawGuide {
  welcomeMessage?: string;
  seasonalTips?: string;
  restaurants?: Array<{ name: string; distance: string; description: string }>;
  attractions?: Array<{ name: string; distance: string; description: string }>;
  essentials?: Array<{ name: string; placeType: string; distance: string; description: string }>;
}

function buildGuidePrompt(
  propertyName: string,
  address: { street: string; number: string; neighborhood: string; city: string; state: string },
  currentMonth: number,
): string {
  const monthNames = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];
  const month = monthNames[currentMonth - 1];

  return `Gere um guia local para a propriedade "${propertyName}" localizada em:
Endereço: ${address.street}, ${address.number} — ${address.neighborhood}
Cidade: ${address.city}, ${address.state}, Brasil
Mês atual: ${month}

Retorne um JSON com a seguinte estrutura exata:
{
  "welcomeMessage": "Mensagem de boas-vindas personalizada (2-3 frases)",
  "seasonalTips": "Dica sazonal relevante para ${month} nesta cidade (1-2 frases)",
  "restaurants": [
    { "name": "Nome", "distance": "Aprox. X km", "description": "Descrição breve" }
  ],
  "attractions": [
    { "name": "Nome", "distance": "Aprox. X km", "description": "Descrição breve" }
  ],
  "essentials": [
    { "name": "Nome", "placeType": "pharmacy|supermarket|hospital", "distance": "Aprox. X km", "description": "Descrição breve" }
  ]
}

Regras:
- 4 a 5 restaurantes REAIS e conhecidos em ${address.city}
- 3 a 4 atrações REAIS em ${address.city}
- Pelo menos 1 farmácia, 1 supermercado e 1 hospital
- Distâncias realistas baseadas no endereço informado
- Todas as informações devem ser verídicas para ${address.city}, ${address.state}`;
}

export const GuideService = {
  async getOrGenerate(propertyCode: string): Promise<GuideWithPlaces> {
    const guide = await GuideRepository.findByPropertyCode(propertyCode);

    if (guide?.aiGeneratedAt) {
      return guide;
    }

    const property = await PropertyRepository.findByCode(propertyCode);
    if (!property?.address) {
      throw new Error(`Imóvel ou endereço não encontrado: ${propertyCode}`);
    }

    const now = new Date();
    const prompt = buildGuidePrompt(property.name, property.address, now.getMonth() + 1);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: GUIDE_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const generated = JSON.parse(raw) as RawGuide;

    const places = [
      ...(generated.restaurants ?? []).map((r) => ({
        name: r.name,
        category: 'restaurant' as const,
        distance: r.distance,
        description: r.description,
      })),
      ...(generated.attractions ?? []).map((a) => ({
        name: a.name,
        category: 'attraction' as const,
        distance: a.distance,
        description: a.description,
      })),
      ...(generated.essentials ?? []).map((e) => ({
        name: e.name,
        category: 'essential' as const,
        placeType: e.placeType,
        distance: e.distance,
        description: e.description,
      })),
    ];

    return GuideRepository.upsertGenerated(propertyCode, {
      welcomeMessage: generated.welcomeMessage ?? '',
      seasonalTips: generated.seasonalTips ?? '',
      places,
    });
  },

  buildChatContext(
    property: NonNullable<Awaited<ReturnType<typeof PropertyRepository.findByCode>>>,
    guide: GuideWithPlaces | null,
  ): string {
    const addr = property.address;
    const op = property.operational;
    const rules = property.rules;

    const restaurants = guide?.places.filter((p) => p.category === 'restaurant') ?? [];
    const attractions = guide?.places.filter((p) => p.category === 'attraction') ?? [];
    const essentials = guide?.places.filter((p) => p.category === 'essential') ?? [];

    return `Você é um assistente virtual do imóvel "${property.name}" da Seazone.
Responda sempre em português, de forma cordial e objetiva.
Responda APENAS com informações presentes neste contexto — não invente dados.
Se uma pergunta não puder ser respondida com o contexto fornecido, diga que não tem essa informação e sugira contato com o anfitrião.

=== DADOS DO IMÓVEL ===
Nome: ${property.name}
Tipo: ${property.propertyType}
Endereço: ${addr ? `${addr.street}, ${addr.number}, ${addr.neighborhood}, ${addr.city} - ${addr.state}` : 'Não disponível'}
Código: ${property.code}

=== WIFI ===
Rede: ${op?.wifiNetwork ?? 'Não disponível'}
Senha: ${op?.wifiPassword ?? 'Não disponível'}

=== CHECK-IN / CHECK-OUT ===
Check-in: a partir das ${rules?.checkInTime ?? 'Não informado'}
Check-out: até as ${rules?.checkOutTime ?? 'Não informado'}
Self check-in: ${op?.isSelfCheckin ? 'Sim' : 'Não'}
Acesso: ${op?.propertyAccessInstructions ?? 'Não informado'}

=== REGRAS ===
Pets/animais de estimação: ${rules?.allowPet ? 'Permitido' : 'Não permitido'}
Fumar: ${rules?.smokingPermitted ? 'Permitido' : 'Não permitido'}
Crianças: ${rules?.suitableForChildren ? 'Adequado' : 'Não recomendado'}
Bebês: ${rules?.suitableForBabies ? 'Adequado' : 'Não recomendado'}
Eventos: ${rules?.eventsPermitted ? 'Permitido' : 'Não permitido'}

=== ESTACIONAMENTO ===
${op?.hasParkingSpot
  ? `Disponível. ${op.parkingSpotIdentifier ? `Vaga: ${op.parkingSpotIdentifier}.` : ''} ${op.parkingSpotInstructions ?? ''}`
  : 'Não há vaga de estacionamento'}

=== GUIA LOCAL ===
${guide?.welcomeMessage ? `Sobre a região: ${guide.welcomeMessage}` : 'Guia ainda não disponível.'}
${guide?.seasonalTips ? `Dica da temporada: ${guide.seasonalTips}` : ''}

Restaurantes próximos:
${restaurants.map((r) => `- ${r.name} (${r.distance}): ${r.description}`).join('\n') || '- Consulte o guia de experiências'}

Atrações próximas:
${attractions.map((a) => `- ${a.name} (${a.distance}): ${a.description}`).join('\n') || '- Consulte o guia de experiências'}

Serviços essenciais:
${essentials.map((e) => `- ${e.name} (${e.distance}): ${e.description}`).join('\n') || '- Consulte o guia de experiências'}

=== ANFITRIÃO ===
Nome: ${property.host?.name ?? 'Não informado'}
Telefone/WhatsApp: ${property.host?.phone ?? 'Não informado'}`;
  },
};
