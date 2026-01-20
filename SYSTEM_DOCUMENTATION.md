# 📋 Documento Descritivo - Dashboard Mycash+

## 🎯 VISÃO GERAL DO SISTEMA
O **mycash+** é um sistema web completo de gestão financeira familiar que permite múltiplos membros de uma família controlarem suas finanças de forma colaborativa. O sistema funciona como uma aplicação de página única (SPA) onde o usuário navega entre diferentes seções sem recarregar a página. Cada membro da família pode ter suas próprias transações, mas todos compartilham a visualização consolidada das finanças.

---

## 🏗️ ESTRUTURA DE NAVEGAÇÃO

### Sistema de Abas
O sistema possui cinco seções principais: **Dashboard (inicial), Objetivos, Cartões, Transações e Perfil**. A navegação entre elas destaca visualmente a aba ativa.

### Sidebar Desktop
No desktop, há uma barra lateral fixa à esquerda com logotipo, botões de navegação e perfil do usuário. A sidebar possui dois estados:
*   **Expandida:** Mostra logotipo completo, nomes das seções e detalhes do perfil.
*   **Colapsada:** Mostra apenas ícones simplificados e foto do perfil, com tooltips ao passar o mouse.
Um botão circular permite alternar entre os estados com transições suaves. Itens ativos têm fundo preto e ícones verde-limão.

### Header Mobile
Em dispositivos móveis, a sidebar é substituída por um header fixo no topo com o logotipo à esquerda e o avatar do usuário à direita. Ao tocar no avatar, abre-se um menu dropdown com as opções de navegação e logout ("Sair").

---

## 💾 SISTEMA DE DADOS E ESTADO

### Armazenamento Central
O sistema utiliza um contexto global React (`useFinance`) para gerenciar todos os dados.

### Tipos de Dados
*   **Transações:** Registros de receitas ou despesas com valor, descrição, categoria, data, conta/cartão, membro responsável e status.
*   **Objetivos:** Metas financeiras com nome, meta, valor atual, categoria e prazo.
*   **Cartões de Crédito:** Dados como limites, faturas, temas visuais e datas de vencimento.
*   **Contas Bancárias:** Saldo atual e identificação visual.
*   **Membros da Família:** Nome, função, foto e renda.
*   **Categorias:** Listas separadas para receitas e despesas.

### Funções de Cálculo e Filtros
O sistema calcula automaticamente o saldo total, receitas/despesas do período (mensal ou filtrado), taxa de economia e gastos por categoria ou membro. Os **Filtros Globais** (membro, período, tipo e busca) afetam simultaneamente todos os componentes do dashboard.

---

## 🏠 DASHBOARD - COMPONENTES DETALHADOS

### Header e Barra de Busca
Contém campo de busca inteligente (real-time e case-insensitive), botão de filtros avançados (popover no desktop, modal fullscreen no mobile) e um seletor de período com calendário interativo.

### Widget de Membros
Exibe avatares sobrepostos da família. Clicar em um membro filtra todo o dashboard para mostrar apenas os dados daquela pessoa.

### Cards de Resumo Financeiro
*   **Saldo Total (Preto):** Destaque principal, mostrando o dinheiro disponível (contas - faturas).
*   **Receitas (Branco):** Soma das entradas do período.
*   **Despesas (Branco):** Soma das saídas do período.

### Gastos por Categoria (Carrossel)
Carrossel horizontal de cards com gráficos tipo "donut" mostrando o percentual de gasto de cada categoria em relação à receita total.

### Gráfico de Fluxo Financeiro
Gráfico de área (Area Chart) comparando a evolução de receitas (linha verde-limão) e despesas (linha preta) ao longo dos meses, com tooltips interativos.

### Widget de Cartões de Crédito
Lista vertical de cartões mostrando a fatura atual, os últimos 4 dígitos e um badge com o percentual de uso do limite. Cada cartão pode ter temas (Black, Lime ou White).

### Widget de Próximas Despesas
Lista cronológica de contas pendentes (fixas ou de cartão). Permite marcar como pagas e gerencia automaticamente recorrências.

### Seção de Objetivos
Grid de cards com imagens, progresso atual vs. meta e barras de progresso animadas em verde-limão.

### Tabela de Transações Detalhada (Extrato)
Exibe todas as transações com avatar do membro, categoria (badge), conta de origem e valor. Inclui busca local, paginação (5 itens por vez) e estados vazios amigáveis.

---

## 🔄 MODAIS DO SISTEMA

O sistema inclui modais detalhados para:
*   **Nova Transação:** Com formulário completo (tipo, valor, descrição, categoria, conta, parcelas e status).
*   **Adicionar Membro:** Cadastro de nome, função e foto (URL ou Upload).
*   **Adicionar/Detalhes de Cartão:** Configuração de limites, fechamento, vencimento e temas.
*   **Filtros Mobile:** Interface específica para seleção de períodos e filtros em telas menores.

---

## 📊 LÓGICA E ACESSIBILIDADE
*   **Cálculos de Negócio:** Fórmulas rigorosas para saldo total, economia e progresso de metas.
*   **Feedback Visual:** Estados de hover, foco, carregamento (skeletons), erros e notificações tipo "Toast".
*   **Acessibilidade:** Navegação completa por teclado (Tab/Escape), labels semânticos, contraste WCAG AA e suporte a leitores de tela.
