# instructions.md

## 1. Visão Geral do Projeto

**Nome:** Finance Control Web App
**Objetivo:** Aplicativo web de controle de gastos e finanças pessoais focado em performance, UX moderna e dados em tempo real.
**Arquitetura:** Single Page Application (SPA) com Backend-as-a-Service (BaaS).

---

## 2. Tech Stack Final

Abaixo, a lista definitiva de tecnologias e bibliotecas selecionadas para o projeto:

### Core & Build

- **Vite:** Build tool e servidor de desenvolvimento (rápido e leve).
- **React:** Biblioteca de UI.
- **TypeScript:** Tipagem estática e segurança de código.

### Estilização & UI

- **Tailwind CSS:** Framework de utility-first CSS.
- **Shadcn/ui:** Coleção de componentes reutilizáveis e acessíveis (baseado em Radix UI).
- **Framer Motion:** Biblioteca para animações complexas e transições de layout.
- **Lucide React:** Ícones padrão utilizados pelo Shadcn.

### Backend & Data

- **Supabase:** Plataforma Backend-as-a-Service (Autenticação, Banco de Dados Postgres, Storage, Realtime).
- **TanStack Query (React Query):** Gerenciamento de estado assíncrono, cache e revalidação de dados.

### Formulários & Validação

- **React Hook Form:** Gerenciamento performático de formulários.
- **Zod:** Validação de esquemas (schema validation) integrada ao hook form.

### Visualização & Utilitários

- **Recharts:** Biblioteca de gráficos compostos para React (visualização de dados financeiros).
- **date-fns:** Manipulação leve e modular de datas.
- **react-number-format:** Componente para inputs numéricos e monetários com máscaras.

---

## 3. Estrutura de Pastas (Feature-Based Architecture)

Utilizaremos uma arquitetura baseada em domínios (features) para manter o código organizado e escalável. Ao invés de separar por "tipos" (apenas components/hooks), separamos por "assunto".

```text
/
├── .env.local                # Variáveis de ambiente (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── supabase/                 # Configurações locais do Supabase (migrations, types gerados)
│   └── functions/            # Edge Functions (caso necessite lógica server-side customizada)
│
└── src/
    ├── App.tsx               # Componente Raiz
    ├── main.tsx              # Entry point (Providers: ThemeProvider, QueryClientProvider)
    │
    ├── assets/               # Imagens estáticas, logos, fontes locais
    │
    ├── components/           # Componentes COMPARTILHADOS globais (genéricos)
    │   ├── ui/               # Componentes instalados pelo Shadcn (Button, Card, Input...)
    │   ├── layout/           # Layouts macro (Sidebar, Header, AuthLayout, RootLayout)
    │   └── common/           # Componentes utilitários (ex: LoadingSpinner, ErrorBoundary, ThemeToggle)
    │
    ├── lib/                  # Configurações de instâncias de bibliotecas
    │   ├── supabase.ts       # Cliente Supabase singleton
    │   ├── utils.ts          # Utilitário padrão do Shadcn (cn helper)
    │   ├── react-query.ts    # Configuração do QueryClient
    │   └── axios.ts          # (Opcional) Cliente HTTP se precisar de APIs externas
    │
    ├── hooks/                # Custom Hooks GLOBAIS (não atrelados a uma feature específica)
    │   ├── use-mobile.tsx    # Detecção de viewport mobile
    │   └── use-theme.tsx     # Controle de Dark/Light mode
    │
    ├── features/             # O CORAÇÃO DA APLICAÇÃO (Domínios de negócio)
    │   ├── auth/             # Domínio: Autenticação
    │   │   ├── components/   # (LoginForm, RegisterForm, ForgotPassword)
    │   │   ├── hooks/        # (useAuth, useSession)
    │   │   └── types/        # (UserTypes)
    │   │
    │   ├── transactions/     # Domínio: Transações Financeiras
    │   │   ├── components/   # (TransactionTable, AddTransactionModal, TransactionFilter)
    │   │   ├── api/          # (funções que chamam o Supabase: fetchTransactions, addTransaction)
    │   │   └── types/        # (Transaction interface, Category types)
    │   │
    │   └── dashboard/        # Domínio: Visão Geral/Dashboard
    │       └── components/   # (SummaryCards, MonthlyExpensesChart, RevenueVsExpenses)
    │
    ├── pages/                # Rotas da aplicação (Páginas montadas usando features)
    │   ├── AuthPage.tsx
    │   ├── DashboardPage.tsx
    │   └── TransactionsPage.tsx
    │
    ├── routes/               # Configuração de Roteamento
    │   ├── index.tsx         # Definição das rotas (React Router DOM)
    │   └── ProtectedRoute.tsx # HOC para proteger rotas privadas (checa user supabase)
    │
    └── utils/                # Funções utilitárias puras (helpers)
        ├── format-currency.ts # Formatador BRL
        └── format-date.ts     # Formatadores de data
```
