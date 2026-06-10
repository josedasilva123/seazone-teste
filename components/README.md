# Design System — Seazone Guia Digital

Componentes UI organizados em **Atomic Design** + **Domain-Driven** conforme a regra `atomic-design.mdc`. O alias `@/` aponta para a raiz do projeto.

---

## Tokens de design

Definidos em `app/globals.css` via variáveis CSS e expostos ao Tailwind via `@theme inline`.

### Cores

| Variável CSS | Classe Tailwind | Uso |
|---|---|---|
| `--primary` | `text-primary`, `bg-primary` | Azul oceano — ações principais, ícones de destaque |
| `--primary-light` | `bg-primary-light` | Fundo suave de destaque de marca |
| `--primary-hover` | `hover:bg-primary-hover` | Estado hover de elementos primários |
| `--accent` | `text-accent`, `bg-accent` | Teal — acesso ao imóvel, ícones secundários |
| `--accent-light` | `bg-accent-light` | Fundo suave de acento |
| `--background` | `bg-background` | Fundo de página (`#f8fafc`) |
| `--surface` | `bg-surface` | Fundo de cards (`#ffffff`) |
| `--surface-secondary` | `bg-surface-secondary` | Fundo de inputs e badges neutros |
| `--text-heading` | `text-text-heading` | Títulos e headings |
| `--text-body` | `text-text-body` | Texto de corpo padrão |
| `--text-muted` | `text-text-muted` | Labels, metadados, placeholders |
| `--text-subtle` | `text-text-subtle` | Textos de baixo contraste |
| `--border` | `border-border` | Bordas de cards e inputs |
| `--success` / `--success-light` | `text-success`, `bg-success-light` | Políticas permitidas |
| `--danger` / `--danger-light` | `text-danger`, `bg-danger-light` | Políticas proibidas |
| `--warning` / `--warning-light` | `text-warning`, `bg-warning-light` | Alertas |

### Border radius

| Token | Tailwind | Valor |
|---|---|---|
| `--radius-sm` | `rounded-[--radius-sm]` | `0.375rem` |
| `--radius-md` | `rounded-[--radius-md]` | `0.625rem` |
| `--radius-lg` | `rounded-[--radius-lg]` | `1rem` |
| `--radius-xl` | `rounded-[--radius-xl]` | `1.5rem` |

### Sombras

| Token | Tailwind | Uso |
|---|---|---|
| `--shadow-sm` | `shadow-sm` | Cards leves |
| `--shadow-md` | `shadow-md` | Modais, dropdowns |
| `--shadow-lg` | `shadow-lg` | Sobreposições |

---

## Estrutura de pastas

```
components/
├── shared/                   # Reutilizável entre qualquer domínio
│   ├── atoms/
│   │   ├── Button/
│   │   ├── Badge/
│   │   ├── Divider/
│   │   └── index.ts          ← barrel export
│   ├── molecules/
│   │   ├── InfoCard/
│   │   ├── SectionTitle/
│   │   └── index.ts
│   └── organisms/
│       ├── AppHeader/
│       └── index.ts
└── property/                 # Exclusivo do domínio de imóveis
    ├── atoms/
    │   ├── AmenityIcon/
    │   ├── RuleStatus/
    │   └── index.ts
    ├── molecules/
    │   ├── PropertyMeta/
    │   ├── AmenityBadge/
    │   ├── WifiCard/
    │   ├── AccessCard/
    │   ├── RuleItem/
    │   ├── HostCard/
    │   └── index.ts
    ├── organisms/
    │   ├── PropertyHero/
    │   ├── AmenitiesSection/
    │   ├── AccessSection/
    │   ├── StayRulesSection/
    │   ├── HostSection/
    │   └── index.ts
    └── templates/
        ├── PropertyGuideTemplate/
        └── index.ts
```

---

## Catálogo de componentes

### `shared/atoms` — Elementos indivisíveis

#### `Button`

```tsx
import { Button } from '@/components/shared/atoms';

<Button variant="primary" size="md">Confirmar</Button>
<Button variant="secondary" size="sm" fullWidth>Ver mais</Button>
<Button variant="ghost">Cancelar</Button>
<Button variant="danger" disabled>Excluir</Button>
```

| Prop | Tipo | Padrão |
|---|---|---|
| `variant` | `primary \| secondary \| ghost \| danger` | `primary` |
| `size` | `sm \| md \| lg` | `md` |
| `fullWidth` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |

---

#### `Badge`

```tsx
import { Badge } from '@/components/shared/atoms';
import { MdWifi } from 'react-icons/md';

<Badge variant="primary">Apartamento</Badge>
<Badge variant="success" icon={<MdWifi size={12} />}>WiFi</Badge>
<Badge variant="danger" size="sm">Proibido</Badge>
```

| Prop | Tipo | Padrão |
|---|---|---|
| `variant` | `default \| primary \| success \| danger \| warning \| accent` | `default` |
| `size` | `sm \| md` | `md` |
| `icon` | `ReactNode` | — |

---

#### `Divider`

```tsx
import { Divider } from '@/components/shared/atoms';

<Divider />
<Divider label="Ou continue com" />
```

---

### `shared/molecules` — Grupos de átomos

#### `InfoCard`

Usado para informações compactas com ícone: horários de check-in/out, WiFi, etc.

```tsx
import { InfoCard } from '@/components/shared/molecules';
import { MdLogin } from 'react-icons/md';

<InfoCard
  icon={<MdLogin size={20} />}
  label="Check-in"
  value="A partir das 15h"
  variant="highlight"
/>
```

| Prop | Tipo | Padrão |
|---|---|---|
| `icon` | `ReactNode` | obrigatório |
| `label` | `string` | obrigatório |
| `value` | `string` | obrigatório |
| `subvalue` | `string` | — |
| `variant` | `default \| highlight` | `default` |

---

#### `SectionTitle`

```tsx
import { SectionTitle } from '@/components/shared/molecules';

<SectionTitle title="Amenidades" subtitle="O que este imóvel oferece" />
<SectionTitle title="Regras" align="center" />
```

---

### `shared/organisms`

#### `AppHeader`

Header sticky com logo Seazone, código do imóvel e link de atendimento via WhatsApp.

```tsx
import { AppHeader } from '@/components/shared/organisms';

<AppHeader propertyCode="FLN001" />
```

---

### `property/atoms` — Átomos do domínio

#### `AmenityIcon`

```tsx
import { AmenityIcon } from '@/components/property/atoms';

<AmenityIcon amenity="wifi" size={20} />
<AmenityIcon amenity="pool" size={24} className="text-primary" />
```

**AmenityKey válido:** `wifi | tv | airConditioning | kitchen | washingMachine | elevator | balcony | bbqGrill | dishwasher | jacuzzi | pool`

---

#### `RuleStatus`

Indicador visual de permissão/proibição.

```tsx
import { RuleStatus } from '@/components/property/atoms';

<RuleStatus allowed label="Aceita pets" />
<RuleStatus allowed={false} label="Eventos proibidos" />
```

---

### `property/molecules` — Moléculas do domínio

#### `PropertyMeta`

```tsx
import { PropertyMeta } from '@/components/property/molecules';

<PropertyMeta bedrooms={2} bathrooms={1} maxGuests={4} />
// → 🛏 2 quarto(s)  🛁 1 banheiro(s)  👥 4 hóspede(s)
```

---

#### `AmenityBadge`

```tsx
import { AmenityBadge } from '@/components/property/molecules';

<AmenityBadge amenity="airConditioning" />
// → ❄️ Ar-condicionado
```

---

#### `WifiCard`

Card interativo com botão de copiar senha (usa `navigator.clipboard`). Deve ser `'use client'`.

```tsx
import { WifiCard } from '@/components/property/molecules';

<WifiCard network="SeazoneGuest5G" password="sea@2024" />
```

---

#### `AccessCard`

```tsx
import { AccessCard } from '@/components/property/molecules';

<AccessCard
  type="smart_lock"          // 'smart_lock' | 'key_safe' | 'physical_key' | 'other'
  instructions="Baixe o app Nuki e use o código."
  password="4321"
  parking={{ identifier: 'Vaga 12', instructions: 'Subsolo 1' }}
/>
```

---

#### `RuleItem`

```tsx
import { RuleItem } from '@/components/property/molecules';

<RuleItem policy="pet" allowed={false} />
// → 🐾 Não aceita animais  (em vermelho)

<RuleItem policy="events" allowed />
// → 🎉 Eventos permitidos  (em verde)
```

**PolicyKey válido:** `pet | smoking | children | babies | events`

---

#### `HostCard`

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

---

### `property/organisms` — Seções completas

| Organismo | Props principais |
|---|---|
| `PropertyHero` | `name`, `propertyType`, `city`, `state`, `bedrooms`, `bathrooms`, `maxGuests`, `images[]` |
| `AmenitiesSection` | `amenities: Partial<Record<AmenityKey, boolean>>` |
| `AccessSection` | `wifi`, `access`, `parking?` |
| `StayRulesSection` | `checkInTime`, `checkOutTime`, `allowPet`, `smokingPermitted`, `suitableForChildren`, `suitableForBabies`, `eventsPermitted` |
| `HostSection` | `host: { name, phone }`, `address?` |

---

### `property/templates`

#### `PropertyGuideTemplate`

Composição completa do guia do hóspede. Recebe todos os dados do imóvel e monta todas as seções.

```tsx
import { PropertyGuideTemplate } from '@/components/property/templates';

// Em app/[code]/page.tsx:
export default async function GuidePage({ params }) {
  const { code } = await params;
  const property = await getPropertyByCode(code); // Server Action

  return <PropertyGuideTemplate code={code} {...property} />;
}
```

---

## Regras de dependência

```
Template → Organismos → Moléculas → Átomos
shared/* ← pode ser importado por qualquer camada
property/* ← não importa de outros domínios (ex: booking, auth)
```

---

## Convenções de implementação

- **Nunca** use cores hardcoded — sempre tokens CSS (`text-primary`, `bg-surface`, etc.)
- **Nunca** importe diretamente do arquivo (`/Button/index.tsx`) — use o barrel da camada (`shared/atoms`)
- Componentes com estado do cliente levam `'use client'` no topo do arquivo (ex: `WifiCard`, `PropertyHero`)
- Cada componente tem seu arquivo de teste colocado junto (`ComponentName.test.tsx`)
