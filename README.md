# 💰 Controle Financeiro

> Aplicação web moderna para controle financeiro pessoal, construída com React, TypeScript e Supabase.

## 📋 Sobre o Projeto

O **Controle Financeiro** é uma aplicação SPA (Single Page Application) desenvolvida para ajudar você a gerenciar suas finanças pessoais com uma interface moderna, intuitiva e responsiva. Com recursos de autenticação segura, visualização em tempo real de transações e gráficos interativos, você terá controle total sobre suas receitas e despesas.

---

## 🎨 Paleta de Cores

A paleta de cores foi cuidadosamente escolhida para transmitir confiança, crescimento e profissionalismo no contexto financeiro:

| Cor                           | Hex                         | Uso                                        |
| ----------------------------- | --------------------------- | ------------------------------------------ |
| **Verde Esmeralda Principal** | `#059669` (`emerald-600`)   | Elementos primários, botões, ícones ativos |
| **Verde Esmeralda Escuro**    | `#047857` (`emerald-700`)   | Hover states, gradientes                   |
| **Verde Teal**                | `#0f766e` (`teal-700`)      | Acentos secundários                        |
| **Verde Esmeralda Claro**     | `#10b981`                   | Destaques, sucesso                         |
| **Azul Real**                 | `#2563eb` (`blue-600`)      | Edição, informações, filtros               |
| **Vermelho Perigo**           | `#dc2626` (`red-600`)       | Despesas, exclusão, erros                  |
| **Branco/Transparência**      | `rgba(255,255,255,0.1-0.9)` | Glassmorphism, overlays                    |

**Gradientes Principais:**

- Botões: `from-emerald-600 to-emerald-700`
- Sidebar: `from-emerald-50 to-white` (light) / `from-emerald-950 to-background` (dark)
- Textos Destaque: `from-emerald-700 to-emerald-900` (light) / `from-emerald-400 to-emerald-200` (dark)

---

## 🚀 Stack Tecnológica

### Core

- **[React](https://react.dev/)** `^19.2.0` - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** `~5.9.3` - Tipagem estática
- **[Vite](https://vite.dev/)** `^7.2.4` - Build tool e dev server

### Roteamento & Estado

- **[React Router DOM](https://reactrouter.com/)** `^7.11.0` - Roteamento
- **[TanStack Query](https://tanstack.com/query)** `^5.90.12` - Gerenciamento de estado do servidor

### Backend/Database

- **[Supabase](https://supabase.com/)** `^2.89.0` - Backend-as-a-Service (Auth + PostgreSQL)

### Estilização

- **[Tailwind CSS](https://tailwindcss.com/)** `^3.4.17` - Utility-first CSS
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes UI acessíveis
- **[Framer Motion](https://www.framer.com/motion/)** `^12.23.26` - Animações
- **[Lucide React](https://lucide.dev/)** `^0.562.0` - Ícones
- **[Sonner](https://sonner.emilkowal.ski/)** `^1.7.2` - Notificações Toast modernas
- **[next-themes](https://github.com/pacocoursey/next-themes)** `^0.4.6` - Tema Dark/Light

### Formulários & Validação

- **[React Hook Form](https://react-hook-form.com/)** `^7.69.0` - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** `^4.2.1` - Schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** `^5.2.2` - Integração Zod + RHF

### Utilitários

- **[date-fns](https://date-fns.org/)** `^4.1.0` - Formatação de datas
- **[react-number-format](https://www.npmjs.com/package/react-number-format)** `^5.4.4` - Máscaras de input
- **[clsx](https://github.com/lukeed/clsx)** + **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Utilitários de classes CSS

### Data Visualization

- **[Recharts](https://recharts.org/)** `^3.6.0` - Gráficos e visualizações
- **[TanStack Table](https://tanstack.com/table)** `^8.21.3` - Tabelas interativas

---

## 🚀 Deploy e Otimização

### Vercel

O projeto está configurado para deploy contínuo na **Vercel**.

- **Variáveis de Ambiente**: Devem ser configuradas diretamente no painel da Vercel (_Settings > Environment Variables_), pois o arquivo `.env.local` é ignorado pelo Git por segurança.
- **Otimização de Build**: Configuração de `manualChunks` no Vite para dividir bibliotecas grandes (`vendor-react`, `vendor-ui`, `vendor-utils`, etc.) em arquivos menores, evitando warnings de chunk size (>500kb) e melhorando o caching.

### SPA Routing (Single Page Application)

Para que o roteamento client-side funcione corretamente em produção (evitando erro 404 ao atualizar páginas como `/dashboard` ou `/transactions`), o projeto utiliza um arquivo `vercel.json` com configuração de **rewrites**:

```json
{
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

**O que faz:**
- Redireciona todas as rotas (exceto `/api/*`) para o `index.html`
- Permite que o React Router gerencie o roteamento no navegador
- Resolve o erro 404 ao acessar diretamente URLs ou atualizar páginas

> **Importante:** Sem essa configuração, a Vercel procura arquivos físicos para cada rota (ex: `/dashboard/index.html`), que não existem em SPAs.

### PWA (Progressive Web App)

O aplicativo suporta instalação como app nativo através da opção **"Adicionar à Tela Inicial"** em dispositivos móveis:

#### Configuração

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Meta tags para PWA e Apple Touch Icon |
| `public/manifest.json` | Configuração do Web App Manifest |
| `public/carteira.ico` | Favicon para navegadores desktop |
| `public/carteira-192.png` | Ícone 192x192 para iOS e Android |
| `public/carteira-512.png` | Ícone 512x512 para splash screen Android |

#### Suporte por Plataforma

| Plataforma | Tecnologia | Ícone Utilizado |
|------------|------------|-----------------|
| **iOS (Safari)** | Apple Touch Icon | `carteira-192.png` |
| **Android (Chrome)** | Web App Manifest | `carteira-192.png` / `carteira-512.png` |
| **Desktop** | Favicon | `carteira.ico` |

#### Meta Tags PWA

```html
<meta name="theme-color" content="#059669" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Finanças" />
<link rel="manifest" href="/manifest.json" />
```

---

## 📁 Estrutura de Pastas

```
src/
├── assets/                 # Imagens, fontes e arquivos estáticos
├── components/
│   ├── common/            # Componentes reutilizáveis (ThemeProvider, ModeToggle)
│   ├── layout/            # Layouts (AuthLayout, DashboardLayout)
│   └── ui/                # Shadcn UI components (Button, Card, Input, Dialog, etc.)
├── features/              # Features organizadas por domínio
│   ├── auth/
│   │   ├── components/    # LoginForm, RegisterForm
│   │   ├── hooks/         # useAuth
│   │   └── types/         # Tipos de autenticação
│   ├── dashboard/
│   │   └── components/    # SummaryCards, MonthlyExpensesChart
│   └── transactions/
│   │   ├── api/           # fetchTransactions, addTransaction, deleteTransaction
│   │   ├── components/    # AddTransactionModal, EditTransactionModal,
│   │   │                  # DeleteTransactionButton, DataTable, columns
│   │   └── types/         # Tipos de Transaction
├── hooks/                 # Custom hooks globais
├── lib/                   # Configurações e utilitários
│   ├── supabase.ts        # Cliente Supabase
│   ├── react-query.ts     # Configuração TanStack Query
│   └── utils.ts           # Função cn() e outros utilitários
├── pages/                 # Componentes de páginas
│   ├── AuthPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   └── TransactionsPage.tsx
├── routes/                # Configuração de rotas
│   └── ProtectedRoute.tsx
├── App.tsx                # Componente raiz com rotas
├── main.tsx               # Entry point (Providers)
└── index.css              # Estilos globais e variáveis CSS

public/                    # Assets públicos
.env.local                 # Variáveis de ambiente (Supabase)
```

---

## ⚙️ Configuração e Instalação

### Pré-requisitos

- **Node.js** 18+ (recomendado: 20+)
- **npm** ou **yarn**
- **Conta no [Supabase](https://supabase.com)**

### Passo a Passo

1. **Clone o repositório**

```bash
git clone <seu-repositorio>
cd Controle-Financas
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

> **Como obter as credenciais:**
>
> 1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
> 2. Vá em **Settings > API**
> 3. Copie a **Project URL** e a **anon/public key**

4. **Configure o banco de dados**

Execute o seguinte SQL no **SQL Editor** do Supabase:

```sql
-- Criar tipo ENUM para transações
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- Criar tabela de transações
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type transaction_type NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);
```

5. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

---

## 🔐 Configuração do Supabase Auth

Para facilitar o desenvolvimento, é recomendado desabilitar a confirmação de email:

1. Acesse **Authentication > Providers > Email** no dashboard Supabase
2. Desmarque "**Confirm email**"
3. Clique em **Save**

---

## 🏗️ Scripts Disponíveis

```bash
npm run dev       # Inicia servidor de desenvolvimento
npm run build     # Build de produção (TypeScript + Vite)
npm run preview   # Preview do build de produção
npm run lint      # Executa ESLint
```

---

## 🎯 Funcionalidades

### ✅ Implementadas

#### Autenticação & Segurança

- [x] **Login e Registro** com validação em PT-BR
- [x] **Formulários modernos** com ícones, gradientes e feedback visual
- [x] **Rotas protegidas** com redirecionamento automático
- [x] **Logout** seguro com confirmação

#### Dashboard

- [x] **Cards de resumo** (Saldo Total, Receitas, Despesas)
- [x] **Gráfico mensal** interativo de receitas vs despesas
- [x] **Legenda customizada** (Receitas primeiro, Despesas depois)
- [x] **Tooltip ordenado** (Receitas antes de Despesas)

#### Transações

- [x] **Tabela interativa** com TanStack Table
- [x] **Paginação inteligente** (8 transações por página para manter layout consistente)
- [x] **Controles de navegação** modernos com números de página
- [x] **Efeitos de hover dinâmicos** (verde para receitas, vermelho para despesas)
- [x] **Adicionar transações** via modal estilizado com gradiente
- [x] **Editar transações** clicando na linha da tabela
- [x] **Excluir transações** com modal de confirmação moderno
- [x] **Formatação de valores** em Real (R$)
- [x] **Correção de fuso horário** na exibição de datas
- [x] **Seletor de tipo** com Receita como padrão e primeiro na lista
- [x] **Notificações Toast (Sonner)**: Feedback visual personalizado por ação (Verde: Adicionar, Azul: Editar, Vermelho: Excluir)
- [x] **Filtros Padronizados**: Filtro por Categoria e Período com layout unificado, seletores largos e ícones consistentes

#### Layout & UI

- [x] **Sidebar retrátil** com toggle animado
- [x] **Tooltips** para itens da sidebar quando recolhida
- [x] **Logo centralizado** no header (`$` DollarSign)
- [x] **Tema Dark/Light** persistente
- [x] **Design responsivo** (Mobile-first) com otimizações específicas por página
- [x] **Botão de fechar (X)** estilizado nos modais
- [x] **Animações suaves** e transições
- [x] **Footer fixo** alinhado com a sidebar ("Desenvolvido por Rodrigo Cinelli")
- [x] **Espaçamento vertical consistente** (32px) entre header/conteúdo e conteúdo/footer

#### Responsividade Mobile

- [x] **Breakpoints padronizados**: Base (<640px), sm (≥640px), md (≥768px), lg (≥1024px)
- [x] **Formulários de autenticação**: Padding e títulos responsivos, painel lateral escondido em mobile
- [x] **Dashboard**: Grid de cards adaptável (1→2→3 colunas), gráficos com altura otimizada
- [x] **Transações**: Header empilhado, filtros em coluna, tabela com scroll horizontal, paginação simplificada
- [x] **Modais**: Scroll suave com `max-h-[90dvh] overscroll-contain`, campos em coluna única
- [x] **Gráficos**: Ícones ocultos em mobile, legendas customizadas abaixo do gráfico
- [x] **Perfil**: Info cards em coluna única, campos de senha empilhados

#### Perfil do Usuário

- [x] **Página de perfil** com informações pessoais e segurança
- [x] **Upload de avatar** com preview e feedback visual
- [x] **Avatar dinâmico** refletido no header em tempo real
- [x] **Alteração de senha** com validação
- [x] **Cards centralizados** verticalmente

#### Internacionalização

- [x] **Interface 100% em PT-BR**
- [x] **Mensagens de validação** traduzidas
- [x] **Erros de autenticação** traduzidos (Supabase Auth)
- [x] **Formatação de moeda e data** brasileira

### 🚧 Roadmap

- [ ] Filtros avançados (por data, categoria, tipo)
- [ ] Gerenciamento de categorias personalizadas
- [ ] Exportação de dados (PDF, CSV)
- [ ] Gráficos adicionais (Pizza de categorias, Tendências)
- [ ] Metas financeiras
- [ ] Notificações e alertas
- [ ] Paginação na tabela de transações

---

## 🎨 Design System

### Componentes UI (Shadcn)

Componentes disponíveis em `src/components/ui/`:

- `button`, `input`, `label`, `card`, `form`
- `dropdown-menu`, `sheet`, `avatar`
- `table`, `dialog`, `select`
- `popover`, `calendar`, `alert-dialog`
- `tooltip`

### Convenções de Código

- **Componentes**: PascalCase (`DashboardPage.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useAuth.tsx`)
- **Utilitários**: camelCase (`utils.ts`)
- **Tipos**: PascalCase com sufixo `Type` ou interface (`AuthContextType`)

---

## 📱 Responsividade Mobile

A aplicação foi otimizada para oferecer uma experiência excepcional em dispositivos móveis:

### Breakpoints

| Breakpoint | Largura | Comportamento |
|------------|---------|---------------|
| Base | < 640px | Layout de 1 coluna, elementos empilhados |
| `sm` | ≥ 640px | Layout de 2 colunas, elementos lado a lado |
| `md` | ≥ 768px | Layout expandido para tablets |
| `lg` | ≥ 1024px | Layout desktop completo (3-4 colunas) |

### Otimizações por Página

| Página | Otimizações Mobile |
|--------|-------------------|
| **Login/Registro** | Painel lateral escondido, form centralizado full-width |
| **Dashboard** | Cards 1→2→3 colunas, gráfico 280px altura |
| **Transações** | Tabela com scroll horizontal, filtros empilhados, modais com scroll suave |
| **Gráficos** | Cards 2x2 (ícones ocultos em mobile), legendas customizadas abaixo |
| **Perfil** | Info cards em 1 coluna, grid responsivo |

### Componentes Otimizados

| Componente | Otimizações |
|------------|-------------|
| **Dialog** | `max-h-[90dvh] overflow-y-auto overscroll-contain` para scroll consistente |
| **ChartsSummaryCards** | Ícones `hidden sm:flex` para não comprimir conteúdo em mobile |
| **CategoryPieChart** | Legenda customizada com `flex-wrap` posicionada abaixo do gráfico |
| **DataTable** | `overflow-x-auto` para scroll horizontal, paginação simplificada |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👤 Autor

Desenvolvido com 💚 por **Rodrigo Cinelli**

---

## 📞 Suporte

Para dúvidas ou suporte:

- 📧 Email: seu@email.com
- 💬 Issues: [GitHub Issues](seu-repo/issues)

---

**⭐ Se este projeto te ajudou, considere dar uma estrela!**
