# Seazone — Guia Digital do Hóspede

Aplicação web que entrega aos hóspedes um guia digital completo da propriedade alugada: informações de acesso, WiFi, regras da estadia, contato do anfitrião, guia local gerado por IA e assistente virtual via chat.

---

## Funcionalidades

- **Listagem de imóveis** com paginação e filtros
- **Guia do hóspede** por código de imóvel: WiFi, check-in/out, comodidades, regras, acesso e anfitrião
- **Guia local com IA** gerado sob demanda via OpenAI (restaurantes, atrações, serviços essenciais)
- **Chat assistente** com streaming de respostas e fallback baseado em regras quando a cota da API está esgotada
- **Metadados dinâmicos** (Open Graph / SEO) por imóvel

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) |
| Banco de dados | SQLite via Prisma 7 + `better-sqlite3` |
| ORM | Prisma 7 com driver adapter |
| IA | OpenAI `gpt-4o-mini` |
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
page.tsx → Server Action → Service → Repository → Prisma → SQLite
```

---

## Pré-requisitos

- Node.js 20+
- npm 10+
- Chave de API da OpenAI (opcional — o chat tem fallback sem IA)

---

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

Crie um arquivo `.env` na raiz com:

```env
DATABASE_URL="file:./prisma/dev.db"
OPENAI_API_KEY="sk-..."   # opcional
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
