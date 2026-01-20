# 📚 Tech Stack Documentation & References

Este documento reúne referências, guias rápidos e links oficiais para as tecnologias utilizadas neste projeto.

---

## ⚛️ React
**A Biblioteca para Interfaces de Usuário Web e Nativas**
*   **Site Oficial:** [react.dev](https://react.dev/)
*   **Versão:** 18+ (Utilizando Functional Components e Hooks)

### Conceitos Chave para o Projeto
*   **Componentes:** Blocos de construção reutilizáveis. Mantenha-os puros e pequenos.
*   **Hooks:** Lógica de estado e efeitos (`useState`, `useEffect`, `useContext`, `useMemo`).
*   **Context API:** Gerenciamento de estado global (ex: `useFinance` no projeto).

### Links Úteis
*   [Quick Start](https://react.dev/learn)
*   [Describing the UI](https://react.dev/learn/describing-the-ui)
*   [Thinking in React](https://react.dev/learn/thinking-in-react)

---

## 🟢 Node.js
**Ambiente de Execução JavaScript**
*   **Site Oficial:** [nodejs.org](https://nodejs.org/en)
*   **Uso no Projeto:** Runtime para desenvolvimento (Vite) e gerenciamento de pacotes (npm/yarn).

### Comandos Essenciais
*   `npm install`: Instala dependências listadas no `package.json`.
*   `npm run dev`: Inicia o servidor de desenvolvimento.
*   `npm run build`: Cria a versão de produção.

### Links Úteis
*   [Introduction to Node.js](https://nodejs.org/en/learn/intro-to-nodejs)
*   [NPM CLI Docs](https://docs.npmjs.com/cli/v10/commands/npm)

---

## 🌊 Tailwind CSS
**Framework CSS Utility-First**
*   **Site Oficial:** [tailwindcss.com](https://tailwindcss.com/)
*   **Configuração:** Arquivo `tailwind.config.js` na raiz.

### Padrões do Projeto
*   **Utility-First:** Use classes diretamente no JSX (ex: `flex justify-center p-4`).
*   **Responsividade:** Prefixos `md:`, `lg:`, `xl:` (Mobile-first padrão).
*   **Cores/Tokens:** Use variáveis do tema definidas no config (ex: `bg-primary`, `text-gray-900`).

### Links Úteis
*   [Core Concepts](https://tailwindcss.com/docs/utility-first)
*   [Flexbox & Grid](https://tailwindcss.com/docs/flex-basis)
*   [Responsive Design](https://tailwindcss.com/docs/responsive-design)

---

## ⚡ Vite
**Build Tool de Próxima Geração**
*   **Site Oficial:** [vite.dev](https://vite.dev/)
*   **Função:** Servidor de desenvolvimento ultrarrápido e bundler para produção (Rollup).

### Vantagens
*   **HMR (Hot Module Replacement):** Atualizações instantâneas durante o desenvolvimento.
*   **Suporte a TypeScript:** Nativo e rápido (via esbuild).

### Links Úteis
*   [Getting Started](https://vite.dev/guide/)
*   [Features](https://vite.dev/guide/features.html)

---

## 🔥 Supabase
**A Alternativa Open Source ao Firebase**
*   **Site Oficial:** [supabase.com](https://supabase.com/)
*   **Uso:** Backend as a Service (BaaS) - Banco de Dados (Postgres), Autenticação e Storage.

### Integração
*   **Cliente:** Biblioteca `@supabase/supabase-js`.
*   **Auth:** Gerenciamento de usuários e sessões.
*   **Database:** PostgreSQL com acesso via API REST/GraphQL ou SDK.

### Links Úteis
*   [Documentation](https://supabase.com/docs)
*   [Database Guide](https://supabase.com/docs/guides/database)
*   [Auth Helpers](https://supabase.com/docs/guides/auth)
