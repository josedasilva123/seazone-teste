import { isGeminiQuotaError } from '@/lib/ai';
import type { PropertyRepository } from '@/lib/repositories/property';
import type { GuideRepository } from '@/lib/repositories/guide';

type Property = NonNullable<Awaited<ReturnType<typeof PropertyRepository.findByCode>>>;
type Guide = Awaited<ReturnType<typeof GuideRepository.findByPropertyCode>>;

interface Rule {
  keywords: string[];
  respond: (property: Property, guide: Guide) => string;
}

const RULES: Rule[] = [
  {
    keywords: ['wifi', 'wi-fi', 'wi fi', 'senha', 'internet', 'rede', 'password', 'network'],
    respond: (p) => {
      const op = p.operational;
      if (!op) return 'Não encontrei informações de WiFi para este imóvel.';
      return `A rede WiFi é **${op.wifiNetwork}** e a senha é **${op.wifiPassword}**.`;
    },
  },
  {
    keywords: ['cachorro', 'cão', 'cao', 'gato', 'pet', 'pets', 'animal', 'animais', 'bicho', 'mascote'],
    respond: (p) => {
      const allowed = p.rules?.allowPet;
      if (allowed === undefined) return 'Não encontrei a política de pets para este imóvel.';
      return allowed
        ? 'Sim! Este imóvel **permite animais de estimação**. Fique à vontade para trazer seu pet.'
        : 'Infelizmente este imóvel **não permite animais de estimação**.';
    },
  },
  {
    keywords: ['check-in', 'checkin', 'check in', 'entrar', 'entrada', 'chegar', 'chegada'],
    respond: (p) => {
      const time = p.rules?.checkInTime;
      if (!time) return 'Não encontrei o horário de check-in para este imóvel.';
      return `O check-in pode ser feito **a partir das ${time}**.`;
    },
  },
  {
    keywords: ['check-out', 'checkout', 'check out', 'sair', 'saída', 'saida', 'partida'],
    respond: (p) => {
      const time = p.rules?.checkOutTime;
      if (!time) return 'Não encontrei o horário de check-out para este imóvel.';
      return `O check-out deve ser feito **até as ${time}**.`;
    },
  },
  {
    keywords: ['restaurante', 'comer', 'comida', 'almoco', 'jantar', 'lanche', 'gastronomia'],
    respond: (_, guide) => {
      const restaurants = guide?.places.filter((p) => p.category === 'restaurant') ?? [];
      if (restaurants.length === 0) return 'Não tenho informações sobre restaurantes próximos no momento.';
      const list = restaurants
        .map((r) => `• **${r.name}** (${r.distance}) — ${r.description}`)
        .join('\n');
      return `Aqui estão os restaurantes próximos:\n\n${list}`;
    },
  },
  {
    keywords: ['atração', 'atracao', 'turismo', 'visitar', 'passear', 'passeio', 'ver', 'conhecer', 'ponto turístico'],
    respond: (_, guide) => {
      const attractions = guide?.places.filter((p) => p.category === 'attraction') ?? [];
      if (attractions.length === 0) return 'Não tenho informações sobre atrações próximas no momento.';
      const list = attractions
        .map((a) => `• **${a.name}** (${a.distance}) — ${a.description}`)
        .join('\n');
      return `Atrações próximas ao imóvel:\n\n${list}`;
    },
  },
  {
    keywords: ['farmácia', 'farmacia', 'remédio', 'remedio', 'medicamento', 'hospital', 'supermercado', 'mercado', 'compras', 'essencial'],
    respond: (_, guide) => {
      const essentials = guide?.places.filter((p) => p.category === 'essential') ?? [];
      if (essentials.length === 0) return 'Não tenho informações sobre serviços essenciais próximos no momento.';
      const list = essentials
        .map((e) => `• **${e.name}** (${e.distance}) — ${e.description}`)
        .join('\n');
      return `Serviços essenciais próximos:\n\n${list}`;
    },
  },
  {
    keywords: ['estacionamento', 'garagem', 'vaga', 'carro', 'veículo', 'veiculo', 'parcar', 'estacionar'],
    respond: (p) => {
      const op = p.operational;
      if (!op?.hasParkingSpot) return 'Este imóvel **não possui vaga de estacionamento** própria.';
      const parts: string[] = ['Este imóvel **possui estacionamento**.'];
      if (op.parkingSpotIdentifier) parts.push(`Vaga: ${op.parkingSpotIdentifier}.`);
      if (op.parkingSpotInstructions) parts.push(op.parkingSpotInstructions);
      return parts.join(' ');
    },
  },
  {
    keywords: ['fumar', 'cigarro', 'fumo', 'fumante', 'cigarro', 'tabaco'],
    respond: (p) => {
      const allowed = p.rules?.smokingPermitted;
      if (allowed === undefined) return 'Não encontrei a política de fumantes para este imóvel.';
      return allowed
        ? 'Fumar **é permitido** neste imóvel.'
        : 'Fumar **não é permitido** neste imóvel.';
    },
  },
  {
    keywords: ['acesso', 'chave', 'porta', 'fechadura', 'entrar', 'código', 'codigo', 'cofre'],
    respond: (p) => {
      const op = p.operational;
      if (!op) return 'Não encontrei informações de acesso para este imóvel.';
      return `Instruções de acesso: ${op.propertyAccessInstructions}`;
    },
  },
  {
    keywords: ['anfitrião', 'anfitrao', 'dono', 'proprietário', 'proprietario', 'contato', 'telefone', 'whatsapp', 'ligar'],
    respond: (p) => {
      const host = p.host;
      if (!host) return 'Não encontrei informações do anfitrião.';
      return `O anfitrião é **${host.name}**. Entre em contato pelo telefone/WhatsApp: ${host.phone}.`;
    },
  },
  {
    keywords: ['criança', 'crianca', 'filho', 'filhos', 'bebê', 'bebe', 'infantil'],
    respond: (p) => {
      const r = p.rules;
      if (!r) return 'Não encontrei as regras do imóvel.';
      const parts: string[] = [];
      if (r.suitableForChildren !== undefined)
        parts.push(r.suitableForChildren ? 'Adequado para crianças.' : 'Não recomendado para crianças.');
      if (r.suitableForBabies !== undefined)
        parts.push(r.suitableForBabies ? 'Adequado para bebês.' : 'Não recomendado para bebês.');
      return parts.join(' ') || 'Não encontrei informações sobre crianças/bebês.';
    },
  },
  {
    keywords: ['evento', 'festa', 'churrasco', 'reunião', 'reuniao', 'comemoração', 'comemoracao', 'aniversário', 'aniversario'],
    respond: (p) => {
      const allowed = p.rules?.eventsPermitted;
      if (allowed === undefined) return 'Não encontrei a política de eventos para este imóvel.';
      return allowed
        ? 'Eventos **são permitidos** neste imóvel.'
        : 'Eventos **não são permitidos** neste imóvel.';
    },
  },
];

const FALLBACK_DEFAULT =
  'Não tenho informações suficientes para responder a essa pergunta. ' +
  'Para dúvidas específicas, entre em contato diretamente com o anfitrião.';

export const ChatFallbackService = {
  respond(lastUserMessage: string, property: Property, guide: Guide): string {
    const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const lower = normalize(lastUserMessage);

    for (const rule of RULES) {
      if (rule.keywords.some((kw) => lower.includes(normalize(kw)))) {
        return rule.respond(property, guide);
      }
    }

    return FALLBACK_DEFAULT;
  },

  isQuotaError(err: unknown): boolean {
    return isGeminiQuotaError(err);
  },
};
