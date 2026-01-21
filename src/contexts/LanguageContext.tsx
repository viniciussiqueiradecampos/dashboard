import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Language = 'pt-BR' | 'en-GB';

interface Translations {
    [key: string]: {
        'pt-BR': string;
        'en-GB': string;
    };
}

// Translation dictionary
const translations: Translations = {
    // Login Page
    'login.welcome': {
        'pt-BR': 'Bem-vindo de volta!',
        'en-GB': 'Welcome back!'
    },
    'login.subtitle': {
        'pt-BR': 'Acesse sua conta para continuar',
        'en-GB': 'Sign in to your account to continue'
    },
    'login.email': {
        'pt-BR': 'Email',
        'en-GB': 'Email'
    },
    'login.password': {
        'pt-BR': 'Senha',
        'en-GB': 'Password'
    },
    'login.submit': {
        'pt-BR': 'Entrar',
        'en-GB': 'Sign In'
    },
    'login.noAccount': {
        'pt-BR': 'Não tem uma conta?',
        'en-GB': "Don't have an account?"
    },
    'login.createNow': {
        'pt-BR': 'Crie agora',
        'en-GB': 'Create one'
    },
    'login.error': {
        'pt-BR': 'Erro ao fazer login',
        'en-GB': 'Error signing in'
    },

    // Register Page
    'register.title': {
        'pt-BR': 'Criar Conta',
        'en-GB': 'Create Account'
    },
    'register.subtitle': {
        'pt-BR': 'Preencha os dados para começar',
        'en-GB': 'Fill in your details to get started'
    },
    'register.name': {
        'pt-BR': 'Nome completo',
        'en-GB': 'Full name'
    },
    'register.submit': {
        'pt-BR': 'Criar conta',
        'en-GB': 'Create account'
    },
    'register.hasAccount': {
        'pt-BR': 'Já tem uma conta?',
        'en-GB': 'Already have an account?'
    },
    'register.signIn': {
        'pt-BR': 'Entrar',
        'en-GB': 'Sign in'
    },

    // Dashboard
    'dashboard.title': {
        'pt-BR': 'Dashboard',
        'en-GB': 'Dashboard'
    },
    'dashboard.totalBalance': {
        'pt-BR': 'Saldo Total',
        'en-GB': 'Total Balance'
    },
    'dashboard.income': {
        'pt-BR': 'Receitas',
        'en-GB': 'Income'
    },
    'dashboard.expenses': {
        'pt-BR': 'Despesas',
        'en-GB': 'Expenses'
    },

    // Cards
    'cards.title': {
        'pt-BR': 'Cartões e Dinheiro',
        'en-GB': 'Cards & Cash'
    },
    'cards.subtitle': {
        'pt-BR': 'Gerencie seus cartões, contas bancárias e dinheiro em espécie',
        'en-GB': 'Manage your cards, bank accounts and cash'
    },
    'cards.newCard': {
        'pt-BR': 'Novo Cartão/Conta',
        'en-GB': 'New Card/Account'
    },
    'cards.dueDay': {
        'pt-BR': 'Vence dia',
        'en-GB': 'Due day'
    },
    'cards.availableLimit': {
        'pt-BR': 'Limite disponível',
        'en-GB': 'Available limit'
    },
    'cards.totalLimit': {
        'pt-BR': 'Limite total',
        'en-GB': 'Total limit'
    },
    'cards.cardsAndAccounts': {
        'pt-BR': 'Cards & contas',
        'en-GB': 'Cards & accounts'
    },

    // Transactions
    'transactions.title': {
        'pt-BR': 'Extrato detalhado',
        'en-GB': 'Detailed Statement'
    },
    'transactions.search': {
        'pt-BR': 'Buscar lançamentos...',
        'en-GB': 'Search transactions...'
    },
    'transactions.all': {
        'pt-BR': 'Todos',
        'en-GB': 'All'
    },
    'transactions.income': {
        'pt-BR': 'Receitas',
        'en-GB': 'Income'
    },
    'transactions.expense': {
        'pt-BR': 'Despesas',
        'en-GB': 'Expenses'
    },
    'transactions.recurring': {
        'pt-BR': 'Transações Recorrentes',
        'en-GB': 'Recurring Transactions'
    },
    'transactions.registerFixed': {
        'pt-BR': 'Registre despesas e receitas fixas',
        'en-GB': 'Register fixed income and expenses'
    },

    // Goals
    'goals.title': {
        'pt-BR': 'Metas & Objetivos',
        'en-GB': 'Goals & Objectives'
    },
    'goals.newGoal': {
        'pt-BR': 'Nova Meta',
        'en-GB': 'New Goal'
    },

    // Profile
    'profile.title': {
        'pt-BR': 'Perfil',
        'en-GB': 'Profile'
    },
    'profile.familyMembers': {
        'pt-BR': 'Membros da Família',
        'en-GB': 'Family Members'
    },

    // Settings
    'settings.title': {
        'pt-BR': 'Configurações',
        'en-GB': 'Settings'
    },
    'settings.currency': {
        'pt-BR': 'Moeda',
        'en-GB': 'Currency'
    },
    'settings.language': {
        'pt-BR': 'Idioma',
        'en-GB': 'Language'
    },
    'settings.menuItems': {
        'pt-BR': 'Itens do Menu',
        'en-GB': 'Menu Items'
    },
    'settings.enabled': {
        'pt-BR': 'Ativo',
        'en-GB': 'Enabled'
    },
    'settings.disabled': {
        'pt-BR': 'Desativado',
        'en-GB': 'Disabled'
    },

    // Common
    'common.save': {
        'pt-BR': 'Salvar',
        'en-GB': 'Save'
    },
    'common.cancel': {
        'pt-BR': 'Cancelar',
        'en-GB': 'Cancel'
    },
    'common.delete': {
        'pt-BR': 'Excluir',
        'en-GB': 'Delete'
    },
    'common.edit': {
        'pt-BR': 'Editar',
        'en-GB': 'Edit'
    },
    'common.add': {
        'pt-BR': 'Adicionar',
        'en-GB': 'Add'
    },
    'common.close': {
        'pt-BR': 'Fechar',
        'en-GB': 'Close'
    },
    'common.loading': {
        'pt-BR': 'Carregando...',
        'en-GB': 'Loading...'
    },
    'common.noData': {
        'pt-BR': 'Nenhum dado encontrado',
        'en-GB': 'No data found'
    },

    // Sidebar
    'sidebar.dashboard': {
        'pt-BR': 'Dashboard',
        'en-GB': 'Dashboard'
    },
    'sidebar.transactions': {
        'pt-BR': 'Transações',
        'en-GB': 'Transactions'
    },
    'sidebar.cards': {
        'pt-BR': 'Cartões',
        'en-GB': 'Cards'
    },
    'sidebar.goals': {
        'pt-BR': 'Metas',
        'en-GB': 'Goals'
    },
    'sidebar.profile': {
        'pt-BR': 'Perfil',
        'en-GB': 'Profile'
    },
    'sidebar.settings': {
        'pt-BR': 'Configurações',
        'en-GB': 'Settings'
    },
    'sidebar.logout': {
        'pt-BR': 'Sair',
        'en-GB': 'Logout'
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('app_language');
        return (saved as Language) || 'pt-BR';
    });

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('app_language', lang);
    }, []);

    const t = useCallback((key: string): string => {
        const translation = translations[key];
        if (!translation) {
            console.warn(`Translation missing for key: ${key}`);
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
