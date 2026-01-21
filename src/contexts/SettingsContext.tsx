import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

export type Currency = 'BRL' | 'USD' | 'EUR' | 'GBP';

export interface MenuItemConfig {
    id: string;
    name: string;
    enabled: boolean;
}

interface SettingsContextType {
    currency: Currency;
    setCurrency: (c: Currency) => void;
    menuItems: MenuItemConfig[];
    toggleMenuItem: (id: string) => void;
    isMasterUser: boolean;
    formatCurrency: (value: number) => string;
    t: (key: string) => string;
}

const DEFAULT_MENU_ITEMS: MenuItemConfig[] = [
    { id: 'dashboard', name: 'Dashboard', enabled: true },
    { id: 'transactions', name: 'Transações', enabled: true },
    { id: 'cards', name: 'Cartões', enabled: true },
    { id: 'goals', name: 'Metas', enabled: true },
    { id: 'profile', name: 'Perfil', enabled: true },
];

const TRANSLATIONS: Record<string, Record<string, string>> = {
    'pt-BR': {
        'Dashboard': 'Dashboard',
        'Transações': 'Transações',
        'Cartões': 'Cartões',
        'Metas': 'Metas',
        'Perfil': 'Perfil',
        'Sair': 'Sair',
        'Configurações': 'Configurações',
        'Fluxo financeiro': 'Fluxo financeiro',
        'Receitas': 'Receitas',
        'Despesas': 'Despesas',
        'Transações Recorrentes': 'Transações Recorrentes',
        'Nenhuma despesa pendente': 'Nenhuma despesa pendente',
        'Cards & contas': 'Cards & contas',
        'Adicionar conta ou cartão': 'Adicionar conta ou cartão',
        'Adicionar primeiro cartão': 'Adicionar primeiro cartão',
        'Nenhum cartão ou conta cadastrado': 'Nenhum cartão ou conta cadastrado',
        'Extrato detalhado': 'Extrato detalhado',
        'Buscar lançamentos...': 'Buscar lançamentos...',
        'Todos': 'Todos',
        'Membro': 'Membro',
        'Datas': 'Datas',
        'Descrição': 'Descrição',
        'Categorias': 'Categorias',
        'Conta/cartão': 'Conta/cartão',
        'Parcelas': 'Parcelas',
        'Valor': 'Valor',
        'Anterior': 'Anterior',
        'Próxima': 'Próxima',
        'Página': 'Página',
        'de': 'de',
        'Mostrando': 'Mostrando',
        'a': 'a',
        'Nenhum lançamento encontrado.': 'Nenhum lançamento encontrado.',
        'Limite Total': 'Limite Total',
        'Fatura Atual': 'Fatura Atual',
        'Disponível': 'Disponível',
        'Uso do Limite': 'Uso do Limite',
        'Fechamento': 'Fechamento',
        'Vencimento': 'Vencimento',
        'Limite Utilizado': 'Limite Utilizado',
        'Despesas neste Cartão': 'Despesas neste Cartão',
        'Fechar': 'Fechar',
        'Editar Cartão': 'Editar Cartão',
        'Salvar': 'Salvar',
        'Adicionar Despesa': 'Adicionar Despesa',
        'Recebido': 'Recebido',
        'Pago': 'Pago',
        'Aguardando recebimento': 'Aguardando recebimento',
        'Agendado / Pendente': 'Agendado / Pendente',
        'Valor já entrou na conta': 'Valor já entrou na conta',
        'Valor já saiu da conta': 'Valor já saiu da conta',
        'Receita Recorrente': 'Receita Recorrente',
        'Despesa Recorrente': 'Despesa Recorrente',
        'Parcelamento': 'Parcelamento',
        'Conta / Método': 'Conta / Método',
        'Família (Geral)': 'Família (Geral)',
        'Selecione...': 'Selecione...',
        'Contas / Métodos': 'Contas / Métodos',
        'Cartões de Crédito': 'Cartões de Crédito',
        'Dinheiro (Espécie)': 'Dinheiro (Espécie)',
        '+ Adicionar Modo/Conta': '+ Adicionar Modo/Conta',
        'Ex: Mercado': 'Ex: Mercado',
        'Receita': 'Receita',
        'Despesa': 'Despesa',
        'Cancelar': 'Cancelar',
        'Salvar Transação': 'Salvar Transação'
    },
    'en-US': {
        'Dashboard': 'Dashboard',
        'Transações': 'Transactions',
        'Cartões': 'Cards',
        'Metas': 'Goals',
        'Perfil': 'Profile',
        'Sair': 'Logout',
        'Configurações': 'Settings',
        'Fluxo financeiro': 'Financial Flow',
        'Receitas': 'Income',
        'Despesas': 'Expenses',
        'Transações Recorrentes': 'Recurring Transactions',
        'Nenhuma despesa pendente': 'No pending expenses',
        'Cards & contas': 'Cards & Accounts',
        'Adicionar conta ou cartão': 'Add account or card',
        'Adicionar primeiro cartão': 'Add first card',
        'Nenhum cartão ou conta cadastrado': 'No card or account registered',
        'Extrato detalhado': 'Detailed Statement',
        'Buscar lançamentos...': 'Search transactions...',
        'Todos': 'All',
        'Membro': 'Member',
        'Datas': 'Date',
        'Descrição': 'Description',
        'Categorias': 'Category',
        'Conta/cartão': 'Account/Card',
        'Parcelas': 'Installments',
        'Valor': 'Amount',
        'Anterior': 'Previous',
        'Próxima': 'Next',
        'Página': 'Page',
        'de': 'of',
        'Mostrando': 'Showing',
        'a': 'to',
        'Nenhum lançamento encontrado.': 'No transactions found.',
        'Limite Total': 'Total Limit',
        'Fatura Atual': 'Current Invoice',
        'Disponível': 'Available',
        'Uso do Limite': 'Limit Usage',
        'Fechamento': 'Closing Date',
        'Vencimento': 'Due Date',
        'Limite Utilizado': 'Limit Used',
        'Despesas neste Cartão': 'Expenses on this Card',
        'Fechar': 'Close',
        'Editar Cartão': 'Edit Card',
        'Salvar': 'Save',
        'Adicionar Despesa': 'Add Expense',
        'Recebido': 'Received',
        'Pago': 'Paid',
        'Aguardando recebimento': 'Awaiting payment',
        'Agendado / Pendente': 'Scheduled / Pending',
        'Valor já entrou na conta': 'Amount already in account',
        'Valor já saiu da conta': 'Amount already left account',
        'Receita Recorrente': 'Recurring Income',
        'Despesa Recorrente': 'Recurring Expense',
        'Parcelamento': 'Installments',
        'Conta / Método': 'Account / Method',
        'Família (Geral)': 'Family (General)',
        'Selecione...': 'Select...',
        'Contas / Métodos': 'Accounts / Methods',
        'Cartões de Crédito': 'Credit Cards',
        'Dinheiro (Espécie)': 'Cash',
        '+ Adicionar Modo/Conta': '+ Add Method/Account',
        'Ex: Mercado': 'Ex: Market',
        'Receita': 'Income',
        'Despesa': 'Expense',
        'Cancelar': 'Cancel',
        'Salvar Transação': 'Save Transaction'
    }
};

const MASTER_EMAIL = 'vinisiqueiradecampos@gmail.com';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    const [currency, setCurrencyState] = useState<Currency>(() => {
        const saved = localStorage.getItem('app_currency');
        return (saved as Currency) || 'BRL';
    });

    const [menuItems, setMenuItems] = useState<MenuItemConfig[]>(() => {
        const saved = localStorage.getItem('app_menu_items');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return DEFAULT_MENU_ITEMS;
            }
        }
        return DEFAULT_MENU_ITEMS;
    });

    const isMasterUser = user?.email === MASTER_EMAIL;

    // Load settings from Supabase on mount/auth change
    useEffect(() => {
        if (!user) return;

        const loadSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('user_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error) {
                    console.error('Error loading settings:', error);
                    return;
                }

                // Cast data to any to avoid TS errors
                const settings = data as any;

                if (settings) {
                    // Update Currency
                    if (settings.currency) {
                        setCurrencyState(settings.currency as Currency);
                        localStorage.setItem('app_currency', settings.currency);
                    }

                    // Update Menus
                    if (settings.enabled_menus && Array.isArray(settings.enabled_menus)) {
                        const enabledSet = new Set(settings.enabled_menus as string[]);
                        setMenuItems(prev => {
                            const newItems = prev.map(item => ({
                                ...item,
                                enabled: enabledSet.has(item.id)
                            }));
                            localStorage.setItem('app_menu_items', JSON.stringify(newItems));
                            return newItems;
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to load settings:', err);
            }
        };

        loadSettings();
    }, [user]);

    const setCurrency = useCallback(async (c: Currency) => {
        // Optimistic update
        setCurrencyState(c);
        localStorage.setItem('app_currency', c);

        if (user) {
            try {
                const { error } = await supabase
                    .from('user_settings')
                    .upsert({
                        user_id: user.id,
                        currency: c,
                        updated_at: new Date().toISOString()
                    } as any);

                if (error) console.error('Error saving currency to DB:', error);
            } catch (err) {
                console.error('Error saving currency:', err);
            }
        }
    }, [user]);

    const toggleMenuItem = useCallback(async (id: string) => {
        let updatedItems: MenuItemConfig[] = [];

        // Optimistic update
        setMenuItems(prev => {
            updatedItems = prev.map(item =>
                item.id === id ? { ...item, enabled: !item.enabled } : item
            );
            localStorage.setItem('app_menu_items', JSON.stringify(updatedItems));
            return updatedItems;
        });

        if (user) {
            const enabledMenus = updatedItems
                .filter(item => item.enabled)
                .map(item => item.id);

            try {
                const { error } = await supabase
                    .from('user_settings')
                    .upsert({
                        user_id: user.id,
                        enabled_menus: enabledMenus,
                        updated_at: new Date().toISOString()
                    } as any);

                if (error) console.error('Error saving menus to DB:', error);
            } catch (err) {
                console.error('Error saving menus:', err);
            }
        }
    }, [user]);

    const formatCurrency = useCallback((value: number): string => {
        const currencyMap: Record<Currency, { locale: string; currency: string }> = {
            BRL: { locale: 'pt-BR', currency: 'BRL' },
            USD: { locale: 'en-US', currency: 'USD' },
            EUR: { locale: 'de-DE', currency: 'EUR' },
            GBP: { locale: 'en-GB', currency: 'GBP' },
        };

        const config = currencyMap[currency];
        return new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: config.currency,
        }).format(value);
    }, [currency]);

    const t = useCallback((key: string): string => {
        const lang = currency === 'BRL' ? 'pt-BR' : 'en-US';
        return TRANSLATIONS[lang]?.[key] || key;
    }, [currency]);

    return (
        <SettingsContext.Provider value={{
            currency,
            setCurrency,
            menuItems,
            toggleMenuItem,
            isMasterUser,
            formatCurrency,
            t
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
