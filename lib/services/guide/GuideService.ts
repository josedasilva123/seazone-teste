import { generateJsonContent } from '@/lib/ai';
import { GuideRepository } from '@/lib/repositories/guide';
import type { GuideWithPlaces } from '@/lib/repositories/guide';
import { PropertyRepository } from '@/lib/repositories/property';
import {
  GUIDE_MIN_ATTRACTIONS,
  GUIDE_MIN_RESTAURANTS,
  getRawGuideValidationIssues,
  isGuidePlacesComplete,
  type RawGuide,
} from '@/lib/validations/guide';

const GUIDE_GENERATION_MAX_ATTEMPTS = 3;

const GUIDE_SYSTEM_PROMPT = `Você é um especialista em turismo e gastronomia brasileiro. 
Gere um guia local preciso e contextualizado para hóspedes de uma propriedade de temporada.
Responda APENAS com JSON válido, sem markdown, sem texto adicional.
É OBRIGATÓRIO preencher todos os arrays com a quantidade mínima de itens solicitada — respostas incompletas serão rejeitadas.`;

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
    { "name": "Nome do restaurante 1", "distance": "Aprox. X km", "description": "Descrição breve" },
    { "name": "Nome do restaurante 2", "distance": "Aprox. X km", "description": "Descrição breve" },
    { "name": "Nome do restaurante 3", "distance": "Aprox. X km", "description": "Descrição breve" },
    { "name": "Nome do restaurante 4", "distance": "Aprox. X km", "description": "Descrição breve" }
  ],
  "attractions": [
    { "name": "Nome da atração 1", "distance": "Aprox. X km", "description": "Descrição breve" },
    { "name": "Nome da atração 2", "distance": "Aprox. X km", "description": "Descrição breve" },
    { "name": "Nome da atração 3", "distance": "Aprox. X km", "description": "Descrição breve" }
  ],
  "essentials": [
    { "name": "Nome da farmácia", "placeType": "pharmacy", "distance": "Aprox. X km", "description": "Descrição breve" },
    { "name": "Nome do supermercado", "placeType": "supermarket", "distance": "Aprox. X km", "description": "Descrição breve" },
    { "name": "Nome do hospital", "placeType": "hospital", "distance": "Aprox. X km", "description": "Descrição breve" }
  ]
}

Regras OBRIGATÓRIAS:
- O array "restaurants" DEVE conter exatamente entre ${GUIDE_MIN_RESTAURANTS} e 5 restaurantes REAIS e conhecidos em ${address.city}
- O array "attractions" DEVE conter exatamente entre ${GUIDE_MIN_ATTRACTIONS} e 4 atrações REAIS em ${address.city}
- O array "essentials" DEVE incluir pelo menos 1 farmácia (placeType: "pharmacy"), 1 supermercado (placeType: "supermarket") e 1 hospital (placeType: "hospital")
- Cada item deve ter name, distance e description preenchidos
- Distâncias realistas baseadas no endereço informado
- Todas as informações devem ser verídicas para ${address.city}, ${address.state}`;
}

function buildGuideRetryPrompt(basePrompt: string, issues: string[]): string {
  return `${basePrompt}

ATENÇÃO: A resposta anterior foi REJEITADA pelos seguintes motivos:
${issues.map((issue) => `- ${issue}`).join('\n')}

Gere novamente o JSON COMPLETO corrigindo TODOS os problemas acima.
NÃO omita itens dos arrays — o mínimo é ${GUIDE_MIN_RESTAURANTS} restaurantes e ${GUIDE_MIN_ATTRACTIONS} atrações.`;
}

function mapRawGuideToPlaces(generated: RawGuide) {
  return [
    ...generated.restaurants.map((r) => ({
      name: r.name,
      category: 'restaurant' as const,
      distance: r.distance,
      description: r.description,
    })),
    ...generated.attractions.map((a) => ({
      name: a.name,
      category: 'attraction' as const,
      distance: a.distance,
      description: a.description,
    })),
    ...generated.essentials.map((e) => ({
      name: e.name,
      category: 'essential' as const,
      placeType: e.placeType,
      distance: e.distance,
      description: e.description,
    })),
  ];
}

async function generateValidatedGuide(prompt: string): Promise<RawGuide> {
  let lastIssues: string[] = ['Resposta inválida'];

  for (let attempt = 0; attempt < GUIDE_GENERATION_MAX_ATTEMPTS; attempt++) {
    const userPrompt = attempt === 0
      ? prompt
      : buildGuideRetryPrompt(prompt, lastIssues);
    const temperature = attempt === 0 ? 0.7 : 0.4;

    const raw = await generateJsonContent(GUIDE_SYSTEM_PROMPT, userPrompt, temperature);
    const parsed: unknown = JSON.parse(raw);
    const issues = getRawGuideValidationIssues(parsed);

    if (issues.length === 0) {
      return parsed as RawGuide;
    }

    lastIssues = issues;
  }

  throw new Error(`Guia gerado incompleto após ${GUIDE_GENERATION_MAX_ATTEMPTS} tentativas: ${lastIssues.join(' ')}`);
}

export const GuideService = {
  async getOrGenerate(propertyCode: string): Promise<GuideWithPlaces> {
    const guide = await GuideRepository.findByPropertyCode(propertyCode);

    if (guide?.aiGeneratedAt && isGuidePlacesComplete(guide.places)) {
      return guide;
    }

    const property = await PropertyRepository.findByCode(propertyCode);
    if (!property?.address) {
      throw new Error(`Imóvel ou endereço não encontrado: ${propertyCode}`);
    }

    const now = new Date();
    const prompt = buildGuidePrompt(property.name, property.address, now.getMonth() + 1);

    try {
      const generated = await generateValidatedGuide(prompt);

      return GuideRepository.upsertGenerated(propertyCode, {
        welcomeMessage: generated.welcomeMessage,
        seasonalTips: generated.seasonalTips,
        places: mapRawGuideToPlaces(generated),
      });
    } catch (aiError) {
      if (guide && guide.places.length > 0) {
        return guide;
      }
      throw aiError;
    }
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
Use Markdown para formatar respostas quando útil (listas com *, **negrito** para destaques, quebras de linha).
Para cumprimentos e mensagens sociais (olá, bom dia, boa noite, obrigado, tchau), responda de forma acolhedora e ofereça ajuda com o imóvel — nunca diga que não tem informações para cumprimentos.
Responda APENAS com informações presentes neste contexto — não invente dados.
Se uma pergunta sobre o imóvel não puder ser respondida com o contexto fornecido, diga que não tem essa informação e sugira contato com o anfitrião.

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
