import React, { createContext, useContext, useCallback, useEffect } from 'react';

export type Language = 'pt-BR' | 'en-GB';

interface Translations {
    [key: string]: {
        'pt-BR': string;
        'en-GB': string;
    };
}

const translations: Translations = {
    // Login & Register
    'login.welcome': { 'pt-BR': 'Bem-vindo de volta!', 'en-GB': 'Welcome back!' },
    'login.subtitle': { 'pt-BR': 'Acesse sua conta para continuar', 'en-GB': 'Sign in to your account to continue' },
    'login.email': { 'pt-BR': 'Email', 'en-GB': 'Email' },
    'login.password': { 'pt-BR': 'Senha', 'en-GB': 'Password' },
    'login.submit': { 'pt-BR': 'Entrar', 'en-GB': 'Sign In' },
    'login.noAccount': { 'pt-BR': 'Não tem uma conta?', 'en-GB': "Don't have an account?" },
    'login.createNow': { 'pt-BR': 'Crie agora', 'en-GB': 'Create one' },
    'login.error': { 'pt-BR': 'Erro ao fazer login', 'en-GB': 'Error signing in' },
    'register.title': { 'pt-BR': 'Criar Conta', 'en-GB': 'Create Account' },
    'register.subtitle': { 'pt-BR': 'Preencha os dados para começar', 'en-GB': 'Fill in your details to get started' },
    'register.name': { 'pt-BR': 'Nome completo', 'en-GB': 'Full name' },
    'register.submit': { 'pt-BR': 'Criar conta', 'en-GB': 'Create account' },
    'register.hasAccount': { 'pt-BR': 'Já tem uma conta?', 'en-GB': 'Already have an account?' },
    'register.signIn': { 'pt-BR': 'Entrar', 'en-GB': 'Sign in' },

    // Dashboard
    'dashboard.title': { 'pt-BR': 'Dashboard', 'en-GB': 'Dashboard' },
    'dashboard.totalBalance': { 'pt-BR': 'Saldo Total', 'en-GB': 'Total Balance' },
    'dashboard.income': { 'pt-BR': 'Receitas', 'en-GB': 'Income' },
    'dashboard.expenses': { 'pt-BR': 'Despesas', 'en-GB': 'Expenses' },
    'dashboard.searchPlaceholder': { 'pt-BR': 'Pesquisar...', 'en-GB': 'Search...' },
    'dashboard.transactionType': { 'pt-BR': 'Tipo de Transação', 'en-GB': 'Transaction Type' },
    'dashboard.typeAll': { 'pt-BR': 'Todos', 'en-GB': 'All' },
    'dashboard.typeIncome': { 'pt-BR': 'Receitas', 'en-GB': 'Income' },
    'dashboard.typeExpense': { 'pt-BR': 'Despesas', 'en-GB': 'Expenses' },
    'dashboard.newTransaction': { 'pt-BR': 'Nova transação', 'en-GB': 'New Transaction' },
    'dashboard.financialFlow': { 'pt-BR': 'Fluxo Financeiro', 'en-GB': 'Financial Flow' },
    'dashboard.summary': { 'pt-BR': 'Resumo', 'en-GB': 'Summary' },

    // Cards & Accounts
    'cards.title': { 'pt-BR': 'Cartões e Dinheiro', 'en-GB': 'Cards & Cash' },
    'cards.subtitle': { 'pt-BR': 'Gerencie seus cartões, contas bancárias e dinheiro em espécie', 'en-GB': 'Manage your cards, bank accounts and cash' },
    'cards.newCard': { 'pt-BR': 'Novo Cartão/Conta', 'en-GB': 'New Card/Account' },
    'cards.holder': { 'pt-BR': 'Titular', 'en-GB': 'Holder' },
    'cards.selectHolder': { 'pt-BR': 'Selecionar titular', 'en-GB': 'Select holder' },
    'cards.initialBalance': { 'pt-BR': 'Saldo inicial', 'en-GB': 'Initial Balance' },
    'cards.creditCard': { 'pt-BR': 'Cartão de crédito', 'en-GB': 'Credit Card' },
    'cards.cardName': { 'pt-BR': 'Nome do Cartão', 'en-GB': 'Card Name' },
    'cards.bank': { 'pt-BR': 'Banco', 'en-GB': 'Bank' },
    'cards.totalLimit': { 'pt-BR': 'Limite total', 'en-GB': 'Total Limit' },
    'cards.closingDay': { 'pt-BR': 'Dia do fechamento', 'en-GB': 'Closing day' },
    'cards.dueDay': { 'pt-BR': 'Dia do vencimento', 'en-GB': 'Due day' },
    'cards.visualTheme': { 'pt-BR': 'Tema visual', 'en-GB': 'Visual Theme' },
    'cards.logoUrl': { 'pt-BR': 'Url do logotipo', 'en-GB': 'Logo URL' },
    'cards.accountName': { 'pt-BR': 'Nome da Conta', 'en-GB': 'Account Name' },
    'cards.noTransactions': { 'pt-BR': 'Nenhuma despesa registrada neste cartão ainda.', 'en-GB': 'No transactions recorded on this card yet.' },
    'cards.availableLimit': { 'pt-BR': 'Limite disponível', 'en-GB': 'Available limit' },

    // Goals
    'goals.title': { 'pt-BR': 'Minhas Metas', 'en-GB': 'My Goals' },
    'goals.subtitle': { 'pt-BR': 'Defina metas financeiras para realizar seus sonhos.', 'en-GB': 'Set financial goals to achieve your dreams.' },
    'goals.noneFound': { 'pt-BR': 'Nenhum objetivo encontrado', 'en-GB': 'No goals found' },
    'goals.createFirst': { 'pt-BR': 'Criar primeiro objetivo', 'en-GB': 'Create first goal' },
    'goals.newGoal': { 'pt-BR': 'Novo objetivo', 'en-GB': 'New Goal' },
    'goals.goalName': { 'pt-BR': 'Nome do objetivo', 'en-GB': 'Goal Name' },
    'goals.exampleJapan': { 'pt-BR': 'Ex: Viagem para o Japão', 'en-GB': 'Ex: Trip to Japan' },
    'goals.targetValue': { 'pt-BR': 'Valor meta', 'en-GB': 'Target Value' },
    'goals.createBtn': { 'pt-BR': 'Criar objetivo', 'en-GB': 'Create Goal' },

    // Transactions Table
    'transactions.title': { 'pt-BR': 'Extrato detalhado', 'en-GB': 'Detailed Statement' },
    'transactions.search': { 'pt-BR': 'Buscar lançamentos...', 'en-GB': 'Search transactions...' },
    'transactions.all': { 'pt-BR': 'Todos', 'en-GB': 'All' },
    'transactions.income': { 'pt-BR': 'Receitas', 'en-GB': 'Income' },
    'transactions.expense': { 'pt-BR': 'Despesas', 'en-GB': 'Expenses' },

    // Sidebar & Navigation
    'sidebar.dashboard': { 'pt-BR': 'Dashboard', 'en-GB': 'Dashboard' },
    'sidebar.transactions': { 'pt-BR': 'Transações', 'en-GB': 'Transactions' },
    'sidebar.cards': { 'pt-BR': 'Cartões', 'en-GB': 'Cards' },
    'sidebar.goals': { 'pt-BR': 'Metas', 'en-GB': 'Goals' },
    'sidebar.profile': { 'pt-BR': 'Perfil', 'en-GB': 'Profile' },
    'sidebar.settings': { 'pt-BR': 'Configurações', 'en-GB': 'Settings' },
    'sidebar.logout': { 'pt-BR': 'Sair', 'en-GB': 'Logout' },

    // Common UI
    'common.save': { 'pt-BR': 'Salvar', 'en-GB': 'Save' },
    'common.cancel': { 'pt-BR': 'Cancelar', 'en-GB': 'Cancel' },
    'common.delete': { 'pt-BR': 'Excluir', 'en-GB': 'Delete' },
    'common.edit': { 'pt-BR': 'Editar', 'en-GB': 'Edit' },
    'common.add': { 'pt-BR': 'Adicionar', 'en-GB': 'Add' },
    'common.close': { 'pt-BR': 'Fechar', 'en-GB': 'Close' },
    'common.viewAll': { 'pt-BR': 'Ver todos', 'en-GB': 'View all' },
    'common.next': { 'pt-BR': 'Próxima', 'en-GB': 'Next' },
    'common.previous': { 'pt-BR': 'Anterior', 'en-GB': 'Previous' },

    // Simple keys (fallback for dynamic titles)
    'Metas': { 'pt-BR': 'Metas', 'en-GB': 'Goals' },
    'Cartões': { 'pt-BR': 'Cartões', 'en-GB': 'Cards' },
    'Transações': { 'pt-BR': 'Transações', 'en-GB': 'Transactions' },
    'Saldo Total': { 'pt-BR': 'Saldo Total', 'en-GB': 'Total Balance' },
    'Receitas': { 'pt-BR': 'Receitas', 'en-GB': 'Income' },
    'Despesas': { 'pt-BR': 'Despesas', 'en-GB': 'Expenses' },
    'Categoria': { 'pt-BR': 'Categoria', 'en-GB': 'Category' },
    'Fluxo financeiro': { 'pt-BR': 'Fluxo financeiro', 'en-GB': 'Financial Flow' },

    // Categories
    'Água': { 'pt-BR': 'Água', 'en-GB': 'Water' },
    'Luz': { 'pt-BR': 'Luz', 'en-GB': 'Electricity' },
    'Internet': { 'pt-BR': 'Internet', 'en-GB': 'Internet' },
    'Aluguel': { 'pt-BR': 'Aluguel', 'en-GB': 'Rent' },
    'Mercado': { 'pt-BR': 'Mercado', 'en-GB': 'Market' },
    'Saúde': { 'pt-BR': 'Saúde', 'en-GB': 'Health' },
    'Transporte': { 'pt-BR': 'Transporte', 'en-GB': 'Transport' },
    'Lazer': { 'pt-BR': 'Lazer', 'en-GB': 'Leisure' },
    'Outros': { 'pt-BR': 'Outros', 'en-GB': 'Others' },
    'Alimentação': { 'pt-BR': 'Alimentação', 'en-GB': 'Food' },
    'Salário': { 'pt-BR': 'Salário', 'en-GB': 'Salary' },
    'Investimentos': { 'pt-BR': 'Investimentos', 'en-GB': 'Investments' },
    'Educação': { 'pt-BR': 'Educação', 'en-GB': 'Education' },
    'Assinaturas': { 'pt-BR': 'Assinaturas', 'en-GB': 'Subscriptions' },
    'Compras': { 'pt-BR': 'Compras', 'en-GB': 'Shopping' },

    'settings.restrictedAccess': { 'pt-BR': 'Acesso Restrito', 'en-GB': 'Restricted Access' },
    'settings.restrictedMessage': { 'pt-BR': 'Você não tem permissão para acessar esta página.', 'en-GB': 'You do not have permission to access this page.' },
    'settings.title': { 'pt-BR': 'Configurações', 'en-GB': 'Settings' },
    'settings.subtitle': { 'pt-BR': 'Gerencie suas preferências e dados do sistema', 'en-GB': 'Manage your preferences and system data' },
    'settings.adminMode': { 'pt-BR': 'Modo Administrador', 'en-GB': 'Admin Mode' },
    'settings.currency': { 'pt-BR': 'Moeda Principal', 'en-GB': 'Primary Currency' },
    'settings.language': { 'pt-BR': 'Idioma do Sistema', 'en-GB': 'System Language' },
    'settings.menuItems': { 'pt-BR': 'Itens do Menu', 'en-GB': 'Menu Items' },
    'settings.menuItemsSubtitle': { 'pt-BR': 'Ative ou desative widgets no dashboard', 'en-GB': 'Enable or disable widgets on the dashboard' },
    'settings.widgetName': { 'pt-BR': 'Nome do Widget', 'en-GB': 'Widget Name' },
    'settings.dangerTitle': { 'pt-BR': 'Zona de Perigo', 'en-GB': 'Danger Zone' },
    'settings.dangerDescription': { 'pt-BR': 'Ações críticas que podem apagar seus dados permanentemente.', 'en-GB': 'Critical actions that can permanently delete your data.' },
    'settings.resetData': { 'pt-BR': 'Limpar Todos os Dados', 'en-GB': 'Reset All Data' },
    'settings.irreversible': { 'pt-BR': 'Esta ação é irreversível.', 'en-GB': 'This action is irreversible.' },
    'settings.confirmReset': { 'pt-BR': 'Tem certeza que deseja apagar TUDO? Esta ação não pode ser desfeita.', 'en-GB': 'Are you sure you want to delete EVERYTHING? This action cannot be undone.' },
    'settings.resetBtn': { 'pt-BR': 'Zerar Histórico', 'en-GB': 'Reset Everything' },
    'transactions.confirmDelete': { 'pt-BR': 'Confirmar Exclusão', 'en-GB': 'Confirm Deletion' },
    'transactions.deleteMessage': { 'pt-BR': 'Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.', 'en-GB': 'Are you sure you want to delete this transaction? This action cannot be undone.' },
    'transactions.recurrenceCancel': { 'pt-BR': 'Esta é uma transação recorrente. Deseja cancelar as próximas ocorrências também?', 'en-GB': 'This is a recurring transaction. Do you want to cancel future occurrences as well?' },
    'Página': { 'pt-BR': 'Página', 'en-GB': 'Page' },
    'de': { 'pt-BR': 'de', 'en-GB': 'of' },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const language: Language = 'pt-BR';
    const setLanguage = useCallback(() => {
        // No-op as we only support pt-BR now
    }, []);

    const t = useCallback((key: string): string => {
        const translation = translations[key];
        if (!translation) {
            return key;
        }
        return translation[language] || key;
    }, [language]);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
