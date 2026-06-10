# Módulo Property — Guia Digital do Hóspede

Componentes UI exclusivos do domínio de imóveis, organizados em **Atomic Design** conforme a regra `atomic-design.mdc`. Importar sempre via barrel da camada (`@/components/property/atoms`, `/molecules`, `/organisms`, `/templates`).

---

## Visão geral

O módulo cobre **dois fluxos principais**:

| Fluxo | Página | Componente raiz | Descrição |
|---|---|---|---|
| **Listagem** | `app/page.tsx` | `PropertyList` | Grid de imóveis com scroll infinito |
| **Guia do hóspede** | `app/[code]/page.tsx` | `PropertyGuideTemplate` | Página completa com hero, acesso, regras, IA e chat |

```
app/page.tsx ──────────► PropertyList ──► PropertyCard
                              │
                              └── listProperties (Server Action)

app/[code]/page.tsx ───► PropertyGuideTemplate
                              ├── PropertyHero, CheckInOutStrip
                              ├── AmenitiesSection, AccessSection
                              ├── StayRulesSection, HostSection
                              ├── ExperienceGuideSection ──► GET /api/[code]/guide
                              └── ChatAssistant ───────────► POST /api/[code]/chat
```

---

## Estrutura de pastas

```
components/property/
├── atoms/
│   ├── AmenityIcon/          # Ícone + mapa de labels por amenidade
│   ├── RuleStatus/           # Indicador permitido/proibido
│   ├── PropertyCardSkeleton/ # Placeholder de loading da listagem
│   └── index.ts
├── molecules/
│   ├── PropertyMeta/         # Quartos, banheiros, hóspedes
│   ├── PropertyCard/         # Card clicável na listagem
│   ├── AmenityBadge/         # Badge de amenidade
│   ├── WifiCard/             # Rede/senha WiFi com copiar
│   ├── AccessCard/           # Instruções de acesso + estacionamento
│   ├── RuleItem/             # Política de estadia individual
│   ├── HostCard/             # Anfitrião + WhatsApp + endereço
│   ├── CheckInOutStrip/      # Faixa destacada check-in/out
│   ├── PlaceCard/            # Local do guia de experiências
│   └── index.ts
├── organisms/
│   ├── PropertyHero/         # Carrossel de fotos + metadados
│   ├── AmenitiesSection/     # Grid de amenidades
│   ├── AccessSection/        # WiFi + acesso + estacionamento
│   ├── StayRulesSection/     # Horários + políticas
│   ├── HostSection/          # Contato e localização
│   ├── PropertyList/         # Listagem com scroll infinito
│   ├── ExperienceGuideSection/ # Guia IA de lugares próximos
│   ├── ChatAssistant/        # Chat flutuante com streaming
│   └── index.ts
└── templates/
    ├── PropertyGuideTemplate/ # Composição completa do guia
    └── index.ts
```

Cada componente possui `ComponentName.test.tsx` na mesma pasta.

---

## Átomos (`property/atoms`)

### `AmenityIcon`

Renderiza o ícone Material Design correspondente a uma amenidade.

```tsx
import { AmenityIcon, amenityLabelMap } from '@/components/property/atoms';
import type { AmenityKey } from '@/components/property/atoms';

<AmenityIcon amenity="wifi" size={20} />
// amenityLabelMap['wifi'] → 'WiFi'
```

| Prop | Tipo | Padrão |
|---|---|---|
| `amenity` | `AmenityKey` | obrigatório |
| `size` | `number` | `20` |
| `className` | `string` | `''` |

**`AmenityKey` válido:** `wifi` · `tv` · `airConditioning` · `kitchen` · `washingMachine` · `elevator` · `balcony` · `bbqGrill` · `dishwasher` · `jacuzzi` · `pool`

**Export auxiliar:** `amenityLabelMap` — rótulos em português usados por `AmenityBadge`.

---

### `RuleStatus`

Indicador visual de permissão (✓ verde) ou proibição (✗ vermelho).

```tsx
import { RuleStatus } from '@/components/property/atoms';

<RuleStatus allowed label="Aceita pets" />
<RuleStatus allowed={false} label="Eventos proibidos" />
```

| Prop | Tipo | Padrão |
|---|---|---|
| `allowed` | `boolean` | obrigatório |
| `label` | `string` | obrigatório |
| `className` | `string` | `''` |

---

### `PropertyCardSkeleton` / `PropertyCardSkeletonGrid`

Placeholder animado (`animate-pulse`) para a listagem enquanto carrega mais itens.

```tsx
import { PropertyCardSkeleton, PropertyCardSkeletonGrid } from '@/components/property/atoms';

<PropertyCardSkeleton />
<PropertyCardSkeletonGrid count={6} />
```

| Prop (`PropertyCardSkeletonGrid`) | Tipo | Padrão |
|---|---|---|
| `count` | `number` | `6` |

**Observação:** usado internamente por `PropertyList` durante paginação; não precisa ser usado fora desse contexto na maioria dos casos.

---

## Moléculas (`property/molecules`)

### `PropertyMeta`

Exibe quartos, banheiros e capacidade de hóspedes com ícones e pluralização automática.

```tsx
import { PropertyMeta } from '@/components/property/molecules';

<PropertyMeta bedrooms={2} bathrooms={1} maxGuests={4} />
<PropertyMeta bedrooms={2} bathrooms={1} maxGuests={4} tone="inverse" size="sm" />
// → 2 quartos · 1 banheiro · até 4 hóspedes
```

| Prop | Tipo | Padrão |
|---|---|---|
| `bedrooms` | `number` | obrigatório |
| `bathrooms` | `number` | obrigatório |
| `maxGuests` | `number` | obrigatório |
| `tone` | `'default' \| 'inverse'` | `'default'` |
| `size` | `'default' \| 'sm'` | `'default'` |

**Observação:** `tone="inverse"` é usado no `PropertyHero` (texto branco sobre fundo escuro).

---

### `PropertyCard`

Card clicável da listagem. Navega para `/{code}`.

```tsx
import { PropertyCard } from '@/components/property/molecules';

<PropertyCard
  code="FLN001"
  name="Apartamento Beira Mar"
  city="Florianópolis"
  state="SC"
  coverImage={{ url: 'https://...', alt: 'Vista do mar' }}
  dailyRateFrom={350}
/>
```

| Prop | Tipo | Padrão |
|---|---|---|
| `code` | `string` | obrigatório |
| `name` | `string` | obrigatório |
| `city` | `string` | obrigatório |
| `state` | `string` | obrigatório |
| `coverImage` | `{ url, alt? }` | — |
| `dailyRateFrom` | `number` | — |

**Comportamentos:**
- Sem `coverImage`: exibe placeholder "Sem foto".
- Sem `dailyRateFrom`: exibe "Consulte disponibilidade".
- Hover na imagem: leve zoom (`scale-[1.04]`).
- Exibe `{city} - {state}` como título principal (não o `name`).

---

### `AmenityBadge`

Badge com ícone + label da amenidade. Usa `Badge` de `shared/atoms`.

```tsx
import { AmenityBadge } from '@/components/property/molecules';

<AmenityBadge amenity="airConditioning" />
// → ❄️ Ar-condicionado
```

---

### `WifiCard` ⚡ `'use client'`

Card com rede e senha WiFi. Botão **Copiar** usa `navigator.clipboard`.

```tsx
import { WifiCard } from '@/components/property/molecules';

<WifiCard network="SeazoneGuest5G" password="sea@2024" />
```

| Prop | Tipo |
|---|---|
| `network` | `string` |
| `password` | `string` |

**Observação:** feedback visual "Copiado" por 2 segundos após copiar.

---

### `AccessCard`

Instruções de acesso ao imóvel e, opcionalmente, estacionamento.

```tsx
import { AccessCard, getAccessType } from '@/components/property/molecules';

<AccessCard
  type="smart_lock"
  instructions="Baixe o app Nuki e use o código."
  password="4321"
  parking={{ identifier: 'Vaga 12', instructions: 'Subsolo 1' }}
/>

// Normaliza string vinda do banco:
getAccessType('SMART_LOCK') // → 'smart_lock'
```

| Prop | Tipo |
|---|---|
| `type` | `'smart_lock' \| 'key_safe' \| 'physical_key' \| 'other'` |
| `instructions` | `string` |
| `password` | `string` (opcional) |
| `parking` | `{ identifier?, instructions? } \| null` (opcional) |

**Labels por tipo:** Smart Lock · Cofre de Chaves · Chave Física · Acesso ao Imóvel.

**Export auxiliar:** `getAccessType(raw: string)` — normaliza valores do Prisma para o enum tipado.

---

### `RuleItem`

Política de estadia com ícone temático + `RuleStatus`.

```tsx
import { RuleItem } from '@/components/property/molecules';
import type { PolicyKey } from '@/components/property/molecules';

<RuleItem policy="pet" allowed={false} />
<RuleItem policy="events" allowed />
```

**`PolicyKey` válido:** `pet` · `smoking` · `children` · `babies` · `events`

Labels gerados automaticamente (ex.: `pet + false` → "Não aceita animais").

---

### `HostCard`

Perfil do anfitrião com avatar (inicial do nome), telefone formatado, botão WhatsApp e endereço opcional.

```tsx
import { HostCard } from '@/components/property/molecules';

<HostCard
  name="Carlos Silva"
  phone="48999887766"
  address={{
    street: 'Av. Beira Mar Norte',
    number: '500',
    complement: 'Apto 301',
    neighborhood: 'Agronômica',
    city: 'Florianópolis',
    state: 'SC',
    postalCode: '88010-100',
  }}
/>
```

**Comportamentos:**
- WhatsApp: link `https://wa.me/55{digits}` via `Button variant="whatsapp"`.
- Formata telefone brasileiro (10 ou 11 dígitos).
- Endereço renderizado em `<address>` sem itálico.

---

### `CheckInOutStrip`

Faixa horizontal em `bg-primary` exibida logo abaixo do hero — destaque visual dos horários.

```tsx
import { CheckInOutStrip } from '@/components/property/molecules';

<CheckInOutStrip checkInTime="15:00" checkOutTime="11:00" />
// → "A partir das 15:00" · "Até as 11:00"
```

**Observação:** os mesmos horários também aparecem em `StayRulesSection` (como `InfoCard`). A faixa é o destaque rápido; a seção traz o detalhe junto às políticas.

---

### `PlaceCard`

Card compacto para um local do guia de experiências (restaurante, atração, serviço essencial).

```tsx
import { PlaceCard } from '@/components/property/molecules';

<PlaceCard
  name="Restaurante Mar & Sol"
  distance="350 m"
  description="Frutos do mar com vista para a baía."
  icon={<MdRestaurant size={16} />}  // opcional
/>
```

Usado exclusivamente por `ExperienceGuideSection`.

---

## Organismos (`property/organisms`)

### `PropertyHero` ⚡ `'use client'`

Seção hero com carrossel de fotos, blur de fundo, gradiente e metadados do imóvel.

```tsx
import { PropertyHero } from '@/components/property/organisms';

<PropertyHero
  name="Apartamento Beira Mar"
  propertyType="apartment"
  city="Florianópolis"
  state="SC"
  bedrooms={2}
  bathrooms={1}
  maxGuests={4}
  images={[{ url: '...', alt: 'Sala', order: 0 }]}
/>
```

| Prop | Tipo |
|---|---|
| `name` | `string` |
| `propertyType` | `string` (recebido mas não exibido atualmente) |
| `city`, `state` | `string` |
| `bedrooms`, `bathrooms`, `maxGuests` | `number` |
| `images` | `Array<{ url, alt, order }>` |

**Comportamentos:**
- Imagens ordenadas por `order`.
- Carrossel com setas, dots e wrap circular (última → primeira).
- Proporção 16:9, máx. 800px de largura.
- Sem fotos: placeholder "Sem fotos disponíveis".
- Controles só aparecem com `images.length > 1`.

**Observação:** usa `bg-gray-900` / `bg-gray-800` no fundo do hero (valores fixos, não tokens do design system).

---

### `AmenitiesSection`

Lista amenidades disponíveis (`true`) em ordem fixa predefinida.

```tsx
import { AmenitiesSection } from '@/components/property/organisms';

<AmenitiesSection amenities={{ wifi: true, pool: true, kitchen: true }} />
```

**Comportamentos:**
- Retorna `null` se nenhuma amenidade estiver `true` (seção oculta).
- Ordem: wifi → ar-condicionado → piscina → cozinha → TV → … → elevador.
- WiFi aparece aqui **e** em `AccessSection` (badge vs. credenciais).

---

### `AccessSection`

Agrupa `WifiCard` + `AccessCard` (com estacionamento opcional).

```tsx
import { AccessSection } from '@/components/property/organisms';

<AccessSection
  wifi={{ network: 'Guest5G', password: 'abc123' }}
  access={{ type: 'key_safe', instructions: '...', password: '1234' }}
  parking={{ identifier: 'Vaga 12', instructions: 'Subsolo 1' }}
/>
```

---

### `StayRulesSection`

Horários de check-in/out (como `InfoCard`) + card de políticas (`RuleItem`).

```tsx
import { StayRulesSection } from '@/components/property/organisms';

<StayRulesSection
  checkInTime="15:00"
  checkOutTime="11:00"
  allowPet={false}
  smokingPermitted={false}
  suitableForChildren
  suitableForBabies
  eventsPermitted={false}
/>
```

Políticas sempre exibidas na ordem: pet → smoking → children → babies → events.

---

### `HostSection`

Wrapper de `SectionTitle` + `HostCard`.

```tsx
import { HostSection } from '@/components/property/organisms';

<HostSection
  host={{ name: 'Carlos', phone: '48999887766' }}
  address={{ /* ... */ }}
/>
```

---

### `PropertyList` ⚡ `'use client'`

Grid responsivo com **scroll infinito** via `IntersectionObserver`.

```tsx
import { PropertyList } from '@/components/property/organisms';

<PropertyList
  initialItems={items}
  initialPage={1}
  initialTotalPages={5}
  initialTotal={48}
/>
```

| Prop | Tipo | Descrição |
|---|---|---|
| `initialItems` | `PropertyListItem[]` | Primeira página (SSR) |
| `initialPage` | `number` | Página carregada no servidor |
| `initialTotalPages` | `number` | Total de páginas |
| `initialTotal` | `number` | Total de imóveis |

**Comportamentos:**
- `PAGE_SIZE = 12` — carrega 12 itens por página via `listProperties` (Server Action).
- Sentinel invisível dispara `loadMore` com `rootMargin: '300px'`.
- Durante loading: exibe `PropertyCardSkeletonGrid`.
- Estado vazio: "Nenhum imóvel encontrado."
- Fim da lista: mensagem "Você viu todos os N imóveis".
- Erro: mensagem + botão "Tentar novamente".
- Grid: 1 col (mobile) → 2 (sm) → 3 (lg).

---

### `ExperienceGuideSection` ⚡ `'use client'`

Guia de experiências gerado por IA — restaurantes, atrações e serviços essenciais próximos.

```tsx
import { ExperienceGuideSection } from '@/components/property/organisms';

<ExperienceGuideSection code="FLN001" />
```

**API:** `GET /api/{code}/guide`

**Estados da UI:**

| Estado | Quando |
|---|---|
| `GuideSkeleton` | Carregando guia existente |
| `GeneratingState` | `aiGeneratedAt === null` — IA ainda gerando |
| Erro | Falha na API — `Card variant="danger"` |
| Conteúdo | Mensagem de boas-vindas + dicas sazonais + listas de lugares |

**Categorias de lugares (`Place.category`):**
- `restaurant` → Restaurantes próximos
- `attraction` → Atrações próximas
- `essential` → Serviços essenciais (ícone varia por `placeType`: pharmacy, hospital, default)

**Observação:** se o guia ainda não foi gerado, faz uma segunda requisição GET após detectar `aiGeneratedAt === null` (sem polling contínuo).

---

### `ChatAssistant` ⚡ `'use client'`

Assistente virtual flutuante (FAB fixo canto inferior direito) com respostas em **streaming**.

```tsx
import { ChatAssistant } from '@/components/property/organisms';

<ChatAssistant code="FLN001" />
```

**API:** `POST /api/{code}/chat` — body `{ messages: Message[] }`, resposta stream de texto.

**Funcionalidades:**
- Mensagem inicial automática ao abrir.
- 4 perguntas sugeridas pré-definidas.
- Indicador de digitação (`TypingIndicator`) durante streaming.
- Header `X-Is-Fallback: true` reexibe sugestões após resposta fallback.
- AbortController cancela stream ao fechar.
- Layout: fullscreen no mobile, painel 384px no desktop.

**Perguntas sugeridas:** senha WiFi · pets · check-in · restaurantes próximos.

---

## Templates (`property/templates`)

### `PropertyGuideTemplate`

Composição completa do guia do hóspede. Recebe todos os dados do imóvel e monta layout + footer Seazone.

```tsx
import { PropertyGuideTemplate } from '@/components/property/templates';

// Em app/[code]/page.tsx (Server Component):
export default async function GuidePage({ params }) {
  const { code } = await params;
  const property = await getPropertyByCode(code);

  return <PropertyGuideTemplate code={code} {...mappedProperty} />;
}
```

**Composição (ordem de renderização):**

1. `AppHeader` (shared) — logo + código do imóvel
2. `PropertyHero` — carrossel full-bleed
3. `CheckInOutStrip` — faixa de horários
4. `<main>` (max-w-2xl):
   - `AmenitiesSection`
   - `AccessSection`
   - `StayRulesSection`
   - `HostSection`
   - `ExperienceGuideSection`
5. `ChatAssistant` — fixo fora do main
6. Footer Seazone

**Props completas:**

| Prop | Tipo |
|---|---|
| `code` | `string` |
| `name`, `propertyType`, `city`, `state` | `string` |
| `bedrooms`, `bathrooms`, `maxGuests` | `number` |
| `images` | `Array<{ url, alt, order }>` |
| `amenities` | `Partial<Record<AmenityKey, boolean>>` |
| `wifi` | `{ network, password }` |
| `access` | `{ type, instructions, password? }` |
| `parking` | `{ identifier?, instructions? } \| null` |
| `rules` | `{ checkInTime, checkOutTime, allowPet, smokingPermitted, suitableForChildren, suitableForBabies, eventsPermitted }` |
| `host` | `{ name, phone }` |
| `address` | endereço completo (opcional) |

---

## Regras de dependência

```
PropertyGuideTemplate
  └── organisms → molecules → atoms
  └── shared/* (AppHeader, SectionTitle, Button, Card, etc.)

property/* NÃO importa de outros domínios (booking, auth, …)
property/* PODE importar de shared/*
```

| Camada | Pode importar |
|---|---|
| Átomos | nada de `components/` |
| Moléculas | átomos (property ou shared) |
| Organismos | átomos + moléculas (property ou shared) |
| Templates | todas as camadas acima + shared |

---

## Client vs Server

| Componente | `'use client'` | Motivo |
|---|---|---|
| `PropertyHero` | ✅ | Estado do carrossel |
| `WifiCard` | ✅ | Copiar para clipboard |
| `PropertyList` | ✅ | Scroll infinito + Server Action |
| `ExperienceGuideSection` | ✅ | Fetch client-side do guia IA |
| `ChatAssistant` | ✅ | Chat com streaming |
| Demais | ❌ | Renderização estática (SSR) |

---

## Integrações externas

| Componente | Dependência | Endpoint / Action |
|---|---|---|
| `PropertyList` | Server Action | `listProperties` → `@/lib/actions/property` |
| `ExperienceGuideSection` | API Route | `GET /api/[code]/guide` |
| `ChatAssistant` | API Route | `POST /api/[code]/chat` (streaming) |
| `HostCard` | Externa | WhatsApp (`wa.me`) |
| `WifiCard` | Browser API | `navigator.clipboard` |

A page `app/[code]/page.tsx` faz o mapeamento Prisma → props do template (amenities, `getAccessType`, parking condicional).

---

## Convenções e observações importantes

1. **Tokens de design** — preferir classes semânticas (`text-primary`, `bg-surface`, `rounded-[--radius-md]`). Exceção conhecida: `PropertyHero` usa `bg-gray-900`/`bg-gray-800` no overlay.

2. **Barrel exports** — nunca importar de `/ComponentName/index.tsx`; usar `@/components/property/{camada}`.

3. **Testes** — todo componente tem teste unitário colocado junto. Rodar com `npm test` ou `npm run test:run`.

4. **Duplicação intencional de check-in/out** — `CheckInOutStrip` (faixa azul abaixo do hero) e `StayRulesSection` (cards detalhados) exibem os mesmos horários em contextos diferentes.

5. **WiFi em dois lugares** — amenidade `wifi: true` aparece em `AmenitiesSection`; credenciais (rede/senha) ficam em `AccessSection` → `WifiCard`.

6. **`propertyType`** — recebido pelo `PropertyHero` mas não renderizado na UI atual.

7. **`PropertyCard.name`** — prop existe mas o card exibe `city - state` como título principal.

8. **Amenidades ocultas** — `AmenitiesSection` não renderiza nada se todas forem `false`/ausentes.

9. **Estacionamento condicional** — em `app/[code]/page.tsx`, `parking` só é passado se `hasParkingSpot === true`.

10. **Código do imóvel** — normalizado para uppercase na page (`code.toUpperCase()`); links usam o código original.

---

## Referência rápida de importação

```tsx
// Átomos
import { AmenityIcon, amenityLabelMap, RuleStatus, PropertyCardSkeleton } from '@/components/property/atoms';
import type { AmenityKey } from '@/components/property/atoms';

// Moléculas
import {
  PropertyMeta, PropertyCard, AmenityBadge, WifiCard,
  AccessCard, getAccessType, RuleItem, HostCard,
  CheckInOutStrip, PlaceCard,
} from '@/components/property/molecules';
import type { PolicyKey } from '@/components/property/molecules';

// Organismos
import {
  PropertyHero, AmenitiesSection, AccessSection, StayRulesSection,
  HostSection, PropertyList, ExperienceGuideSection, ChatAssistant,
} from '@/components/property/organisms';

// Templates
import { PropertyGuideTemplate } from '@/components/property/templates';
```
