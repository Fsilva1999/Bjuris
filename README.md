# BJuris — Escritório Jurídico Digital

PWA para escritórios de advocacia previdenciária. Acompanha o cliente do primeiro
atendimento até a finalização do caso.

Este repositório contém a **Fase 1** do projeto (ver [Roadmap](#roadmap) abaixo):
estrutura base, PWA instalável, layout e autenticação com Supabase.

## Stack

Vite + React + TypeScript + Tailwind CSS + Supabase (Auth/DB/Storage) + React Router +
TanStack Query. Sem Next.js.

## Pré-requisitos

- Node.js 18+
- Uma conta e um projeto no [Supabase](https://supabase.com)

## Instalação local

```bash
npm install
cp .env.example .env.local
```

Preencha `.env.local` com os dados do seu projeto Supabase (Project Settings → API):

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-publica
```

Rode em desenvolvimento:

```bash
npm run dev
```

## Configuração no Supabase (Fase 1)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Authentication → Providers**, deixe **Email** habilitado (login por e-mail/senha).
3. Nenhuma tabela é necessária ainda nesta fase — o schema completo (perfis, escritórios,
   permissões, RLS) entra na **Fase 2**, descrita a seguir.

## Configuração no Supabase (Fase 2)

### 1. Rodar as migrations

Cole o conteúdo de cada arquivo de `supabase/migrations/` (nesta ordem: `0001`, `0002`,
`0003`, `0004`) no **SQL Editor** do painel do Supabase e execute, ou — se preferir usar a
CLI do Supabase localmente:

```bash
supabase link --project-ref SEU-PROJECT-REF
supabase db push
```

Isso cria: `offices`, `profiles`, `office_members`, `permissions` (com o catálogo inicial
já semeado), `user_permissions`, o trigger que cria automaticamente o perfil/escritório de
quem se cadastra, e todas as políticas de **Row Level Security** — a segurança de
permissões vive no banco, não só no frontend (seção 8/38 do briefing).

### 2. Deploy da Edge Function `create-team-member`

Criar um novo advogado exige a **Service Role Key**, que nunca pode existir no frontend.
Por isso essa operação roda como uma Edge Function, no servidor do Supabase:

```bash
supabase functions deploy create-team-member
```

Nenhuma variável extra é necessária — `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já
ficam disponíveis automaticamente para toda Edge Function do seu projeto.

### 3. Criar o primeiro administrador

Como ainda não há uma tela pública de cadastro (o BJuris é convite-only — só o
administrador convida a equipe), crie o primeiro usuário manualmente:

1. No painel do Supabase, vá em **Authentication → Users → Add user**.
2. Preencha e-mail e senha.
3. Em **User Metadata**, adicione:
   ```json
   {
     "full_name": "Seu Nome",
     "office_name": "Nome do seu escritório"
   }
   ```
4. O trigger `handle_new_user` cria automaticamente o escritório e vincula esse usuário
   como **administrador**. A partir daí, ele pode logar no BJuris e convidar o resto da
   equipe pela tela **Equipe → Advogados**.

### O que a Fase 2 entrega

- Perfis completos de advogados (OAB/UF, telefone, especialidade, cargo, status).
- Convite de novos advogados/colaboradores por e-mail (Edge Function segura).
- Permissões granulares **por módulo** (visualizar/editar cliente, documentos, processos,
  tarefas, financeiro) — editáveis pelo administrador na tela de Equipe.
- RLS em todas as tabelas: um advogado nunca consegue ler/escrever dados fora do seu
  escritório, mesmo chamando a API do Supabase diretamente.
- Permissão **por cliente específico** (ex.: "João só acessa Maria, José e Antônio") fica
  para a Fase 3, quando a tabela `clients` existir — o design já reserva o encaixe
  (`office_members.id` + `clients.id`) para essa tabela.


## Build e verificação

```bash
npm run build
```

Isso roda a checagem de tipos (`tsc -b`) e o build de produção (`vite build`). Corrija
qualquer erro de TypeScript antes de prosseguir para a próxima fase — nenhuma fase deve
avançar com o build quebrado.

## Deploy (GitHub → Vercel)

1. Suba o projeto para um repositório no GitHub (o `.gitignore` já protege `.env*`).
2. Importe o repositório na [Vercel](https://vercel.com/new).
3. Framework preset: **Vite**.
4. Em **Environment Variables**, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
5. Deploy. As rotas SPA já são resolvidas pelo próprio Vite/Vercel para projetos Vite
   (fallback automático para `index.html`).

## PWA

- Manifesto e Service Worker são gerados pelo `vite-plugin-pwa` (ver `vite.config.ts`).
- Chamadas ao Supabase (`*.supabase.co`) **nunca** são servidas do cache — apenas rede,
  para proteger dados jurídicos sensíveis.
- Em produção (`npm run build && npm run preview`), o navegador oferece a opção de
  instalar o BJuris na tela inicial (Android/desktop). No iPhone, use Safari →
  Compartilhar → **Adicionar à Tela de Início**.

## Estrutura de pastas

```
src/
├── components/     # componentes reutilizáveis (ProtectedRoute, RequireAdmin, ...)
├── pages/          # páginas/rotas
├── layouts/         # layouts (ex.: DashboardLayout)
├── hooks/
├── services/
│   ├── supabase/     # teamService.ts, ...
│   ├── scanner/      # Client Scanner — Fase 4
│   ├── ocr/           # OCRService — Fase 4
│   └── documents/
├── lib/             # cliente Supabase
├── types/           # tipos espelhando o schema do banco
├── utils/
├── contexts/        # AuthContext, MembershipContext
├── routes/          # AppRoutes
└── workers/

supabase/
├── migrations/       # schema + RLS, em ordem numérica
└── functions/
    └── create-team-member/   # Edge Function (cria advogados com Service Role)
```

## Roadmap

- [x] **Fase 1** — Vite, React, TS, Tailwind, PWA, Layout, Login, Supabase Auth
- [x] **Fase 2** — Usuários, Escritórios, Advogados, Permissões, RLS
- [ ] **Fase 3** — Clientes, Atendimento, Timeline
- [ ] **Fase 4** — Client Scanner, OCR, Classificação, Organização de documentos, Storage
- [ ] **Fase 5** — Casos, Administrativo, Judicial, Processos
- [ ] **Fase 6** — Prazos, Exigências, Perícias, Audiências, Tarefas
- [ ] **Fase 7** — Financeiro, Relatórios, Notificações (push)
- [ ] **Fase 8** — Segurança, Performance, Responsividade, Testes, Deploy final

Cada fase só avança depois que a anterior builda sem erros — conforme a regra final do
briefing do projeto.
