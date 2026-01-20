# Plano de Integração MyCash+ v2.0 com Supabase

Este documento descreve o roteiro para migrar do sistema mockado atual para uma arquitetura real usando Supabase, baseada no schema Prisma fornecido.

## 1. Banco de Dados (Supabase)

O schema foi unificado. As principais mudanças estruturais são:
- **Unificação de Contas e Cartões**: Agora usamos a tabela `accounts` com um campo `type` (`CHECKING`, `SAVINGS`, `CREDIT_CARD`). Isso simplifica as queries e relações.
- **Tabela de Categorias**: Agora as categorias são dinâmicas e salvas no banco, não mais hardcoded.
- **Recorrência**: Nova tabela `recurring_transactions` para gerenciar despesas fixas.

### Ação Necessária:
Execute o script `supabase_schema_v2.sql` no SQL Editor do Supabase para criar toda a estrutura.

## 2. Autenticação

Implementaremos autenticação via Email/Senha (padrão) ou Google.
- Criaremos um `AuthContext` para gerenciar a sessão do usuário.
- Criaremos telas de **Login** e **Cadastro**.
- O sistema detectará automaticamente o `user_id` logado e filtrará todos os dados por ele (RLS).

## 3. Storage (Arquivos)

Buckets necessários no Supabase Storage:
1. `avatars`: Para fotos de perfil dos `FamilyMembers` e do `User`.
2. `logos`: Para logos de bancos/instituições nas `Accounts`.

## 4. Refatoração do Frontend

Como o schema mudou, precisaremos atualizar profundamente o fontend:

### A. Tipagem (`src/types/index.ts` e `schema.ts`)
Criar interfaces TypeScript que espelhem fielmente o novo banco de dados.

### B. Contexto (`FinanceContext`)
O hook `useFinance` será reescrito para:
- Buscar dados do Supabase ao iniciar.
- Substituir a lógica de mocks por chamadas `supabase.from('table').select/insert/update/delete`.
- Adaptar a lógica de "Contas vs Cartões" para ler tudo da tabela `accounts` e filtrar pelo `type`.

### C. Componentes
- **CreditCardsWidget**: Buscará de `accounts` onde `type = CREDIT_CARD`.
- **TransactionsTable**: Precisará suportar as novas colunas e relacionamentos.
- **Profile**: Upload de imagem para o bucket `avatars`.

## Roteiro de Execução

1. [x] Gerar SQL do Schema.
2. [ ] Instalar dependências de Auth (já temos supabase-js).
3. [ ] Criar `AuthContext` e telas de Login/Registro.
4. [ ] Atualizar tipos TypeScript.
5. [ ] Refatorar `FinanceContext` para conectar ao banco.
6. [ ] Implementar Upload de Imagens.
7. [ ] Testar Fluxo Completo (CRUD).
