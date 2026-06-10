# Seazone — Guia Digital do Hóspede

Aplicação web que entrega aos hóspedes um guia digital completo da propriedade alugada: informações de acesso, WiFi, regras da estadia, contato do anfitrião, guia local gerado por IA e assistente virtual via chat.

---

## Funcionalidades

- **Listagem de imóveis** com paginação e filtros
- **Guia do hóspede** por código de imóvel: WiFi, check-in/out, comodidades, regras, acesso e anfitrião
- **Guia local com IA** gerado sob demanda via Google Gemini (restaurantes, atrações, serviços essenciais)
- **Chat assistente** com streaming de respostas e fallback baseado em regras quando a cota da API está esgotada
- **Metadados dinâmicos** (Open Graph / SEO) por imóvel

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) |
| Banco de dados | PostgreSQL via Prisma 7 + `@prisma/adapter-pg` |
| ORM | Prisma 7 com driver adapter |
| IA | Google Gemini `gemini-2.0-flash` |
| Validação | Zod 4 |
| UI | React 19 + Tailwind CSS 4 |
| Ícones | react-icons |
| Testes | Vitest 4 + React Testing Library + jsdom |
| Linguagem | TypeScript 5 |

---

## Arquitetura

### Estrutura de pastas

```
app/                        # Rotas Next.js (App Router)
  page.tsx                  # Listagem de imóveis
  [code]/page.tsx           # Guia do hóspede por código
  api/[code]/
    guide/route.ts          # GET — gera/retorna guia local
    chat/route.ts           # POST — streaming do chat assistente

components/
  shared/                   # Componentes reutilizáveis entre domínios
    atoms/                  # Button, Badge, Divider
    molecules/              # InfoCard, SectionTitle
    organisms/              # AppHeader
  property/                 # Componentes do domínio de imóveis
    atoms/                  # AmenityIcon, RuleStatus, PropertyCardSkeleton
    molecules/              # PropertyCard, WifiCard, AccessCard, HostCard, RuleItem…
    organisms/              # PropertyHero, AmenitiesSection, ChatAssistant…
    templates/              # PropertyGuideTemplate

lib/
  db/index.ts               # Prisma Client singleton
  actions/                  # Server Actions (entrada pública)
  services/                 # Lógica de negócio
  repositories/             # Acesso ao banco (Prisma)
  validations/              # Schemas Zod

prisma/
  schema.prisma             # Modelos do banco
  seed.ts                   # Dados de exemplo (FLN001, GRM001)

scripts/
  mark-guides-generated.ts  # Utilitário: marca guias existentes como gerados
```

### Fluxo de dados

```
page.tsx → Server Action → Service → Repository → Prisma → PostgreSQL
```

---

## Pré-requisitos

- Node.js 20+
- npm 10+
- PostgreSQL 14+ (instância local ou remota)
- Chave de API do Google Gemini (**obrigatória em produção** para o chat com IA; há fallback só em cota esgotada)

---

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

Crie um arquivo `.env` na raiz com:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/seazone?schema=public"
GEMINI_API_KEY="AIza..."   # obrigatório em produção — obtenha em https://aistudio.google.com/apikey
GEMINI_MODEL="gemini-2.0-flash"   # opcional — padrão: gemini-2.0-flash
```

### 3. Banco de dados

```bash
# Gerar o Prisma Client
npx prisma generate

# Criar o banco e aplicar as migrations
npx prisma migrate dev

# Popular com dados de exemplo
npx prisma db seed
```

### 4. Iniciar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Imóveis de exemplo

| Código | Imóvel |
|---|---|
| `FLN001` | Apartamento Beira-Mar — Florianópolis, SC |
| `GRM001` | Chalé Serra — Gramado, RS |
| `RIO001` | Cobertura Vista Mar — Rio de Janeiro, RJ |
| `SP001` | Loft Design — São Paulo, SP |
| `BUZ001` | Casa de Praia Geribá — Búzios, RJ |
| `POA001` | Apartamento Moinhos de Vento — Porto Alegre, RS |
| `CWB001` | Studio Batel — Curitiba, PR |
| `SSA001` | Flat Barra — Salvador, BA |
| `REC001` | Casa Boa Viagem — Recife, PE |
| `BSB001` | Apartamento Asa Sul — Brasília, DF |
| `MCZ001` | Bangalô Ponta Verde — Maceió, AL |
| `PAR001` | Pousada Centro Histórico — Paraty, RJ |
| `UBA001` | Casa Praia Grande — Ubatuba, SP |
| `CNT001` | Chalé — Campos do Jordão, SP |

Acesse o guia de um imóvel em `/[CODIGO]`, por exemplo: [http://localhost:3000/FLN001](http://localhost:3000/FLN001).

---

## Scripts disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linter (ESLint)
npm test             # Testes em modo watch
npm run test:run     # Testes (execução única — CI)
npm run test:ui      # Interface visual do Vitest
npm run coverage     # Relatório de cobertura
```

### Scripts Prisma

```bash
npx prisma generate          # Regerar Client após alterar o schema
npx prisma migrate dev       # Criar e aplicar migration em dev
npx prisma migrate deploy    # Aplicar migrations em produção
npx prisma studio            # GUI visual do banco
npx prisma db seed           # Popular com dados de exemplo
```

---

## Testes

Os testes unitários ficam junto ao componente/serviço (`*.test.tsx` / `*.test.ts`). Os testes de integração ficam em `tests/integration/`.

```bash
npm run test:run     # Execução única
npm run coverage     # Com relatório de cobertura
```

## Decisões Técnicas

### Ponto de partida

O projeto foi estruturado a partir de regras explícitas por frente de implementação, registradas em arquivos `.mdc` dentro de `.cursor/rules/` (back-end, testes, design system, atomic design). Essas regras funcionam como contrato arquitetural para desenvolvimento assistido por IA: reduzem ambiguidade, padronizam convenções e evitam que cada sessão de implementação reinvente a estrutura do projeto.

Complementam esse contrato o README principal e READMEs internos (por exemplo, em `components/`), que documentam componentes, fluxos e APIs para humanos e para agentes de IA.

### Next.js 16 (App Router)

O framework concentra roteamento, renderização no servidor e integração com React 19 em um único runtime. As páginas (`app/`) buscam dados via Server Actions e renderizam templates com Server Components sempre que possível; componentes `'use client'` ficam restritos a interatividade (chat, paginação, formulários). Essa divisão reduz JavaScript enviado ao navegador e mantém a lógica de dados próxima ao servidor.

### Server Actions e Route Handlers

A maior parte da camada de back-end usa **Server Actions** — listagem de imóveis, busca por código, mutações futuras. A motivação é simplicidade: sem camada HTTP explícita para operações request/response convencionais, o Next.js serializa a chamada diretamente do componente ou da page.

Duas funcionalidades de IA usam **Route Handlers** (`app/api/[code]/guide` e `app/api/[code]/chat`):

- **Guia local** — geração sob demanda com resposta JSON.
- **Chat assistente** — streaming de texto via `ReadableStream`, incompatível com o modelo de retorno das Server Actions.

Em ambos os casos, os handlers são finos: delegam para a mesma camada de **Services** usada pelas Actions. Se no futuro for necessário expor uma Action como REST, basta reutilizar o Service — a lógica de negócio não muda.

Cada Action fica em um arquivo isolado (`lib/actions/[domain]/`) para facilitar essa migração pontual.

### Camadas de back-end

O fluxo obrigatório é:

```
page.tsx / route.ts → Action ou Handler → Service → Repository → Prisma → PostgreSQL
```

| Camada | Responsabilidade |
|---|---|
| **Action / Handler** | Entrada pública, validação Zod, formato de resposta (`ActionResult<T>` ou HTTP) |
| **Service** | Regras de negócio; não conhece Prisma |
| **Repository** | Única camada que acessa `db`; encapsula queries |

Essa separação isola a persistência: trocar ORM ou banco exige alterar apenas os repositories, não a lógica de negócio.

Entradas são validadas com **Zod** antes de chegar ao Service. Server Actions retornam sempre `ActionResult<T>` (`{ ok: true, data }` ou `{ ok: false, error }`), evitando expor exceções não tratadas ao cliente.

### Prisma ORM

O Prisma concentra modelagem declarativa (`schema.prisma`), geração de client tipado e migrações versionadas (`prisma migrate`). Na versão 7, o client exige um **driver adapter** — o projeto usa `@prisma/adapter-pg` com PostgreSQL em produção.

Consultas complexas podem recorrer a `$queryRaw` quando o query builder não for suficiente. O acesso ao banco, porém, permanece confinado aos repositories; Services e Actions nunca importam `db` diretamente.

### Atomic Design + domínios

A UI segue **Atomic Design** (atoms → molecules → organisms → templates) organizada por **domínio funcional** (`property/`, futuros `booking/`, etc.).

O diretório `shared/` reúne componentes reutilizáveis entre domínios; cada domínio mantém seus próprios átomos e moléculas. Regra de dependência: componentes de um domínio não importam de outro — apenas de `shared/`. Essa combinação de Atomic Design com fronteiras por domínio facilita localizar código e escalar o projeto sem acoplamento cruzado.

### Design System

A implementação começou pelos componentes genéricos (`Button`, `Badge`, `InfoCard`…) com tokens semânticos definidos em `globals.css` (`text-primary`, `bg-surface`, `border-border`, etc.) e consumidos via Tailwind CSS 4.

Documentar o catálogo cedo (READMEs + regra `.mdc`) faz com que implementações seguintes se concentrem em lógica e composição, não em estilos ad hoc. Esse padrão acelera iterações porque novas telas reutilizam peças já testadas e visualmente consistentes.

### Google Gemini

O **Gemini 2.5 Flash** foi escolhido por equilibrar latência, qualidade de resposta e cota gratuita — permitindo demonstrar IA funcionando de fato no ambiente de teste, sem custo inicial.

A integração prevê degradação graciosa:

- **Guia local** — conteúdo persistido no banco; geração assíncrona na primeira requisição.
- **Chat** — streaming via API; se a cota esgotar, `ChatFallbackService` responde com regras baseadas nos dados do imóvel (WiFi, pets, check-in, etc.).
- **Chave ausente** — resposta 503 com mensagem clara, sem quebrar a página.

A lógica de IA fica isolada em `lib/ai/`; Services orquestram quando chamar o modelo e quando usar fallback.

### Testes

**Vitest 4** + **React Testing Library** + **jsdom**. Testes unitários ficam colocados junto ao código (`Component.test.tsx`, `Service.test.ts`); testes de integração de fluxo completo ficam em `tests/integration/`. A regra é cobrir renderização, estados (loading, erro, vazio), callbacks e camadas de back-end com mocks de `db` e serviços externos — garantindo regressão rápida sem depender de banco ou API real.