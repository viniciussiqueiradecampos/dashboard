import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

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
}

const DEFAULT_MENU_ITEMS: MenuItemConfig[] = [
    { id: 'dashboard', name: 'Dashboard', enabled: true },
    { id: 'transactions', name: 'Transações', enabled: true },
    { id: 'cards', name: 'Cartões', enabled: true },
    { id: 'goals', name: 'Metas', enabled: true },
    { id: 'profile', name: 'Perfil', enabled: true },
];

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

    const setCurrency = useCallback((c: Currency) => {
        setCurrencyState(c);
        localStorage.setItem('app_currency', c);
    }, []);

    const toggleMenuItem = useCallback((id: string) => {
        setMenuItems(prev => {
            const updated = prev.map(item =>
                item.id === id ? { ...item, enabled: !item.enabled } : item
            );
            localStorage.setItem('app_menu_items', JSON.stringify(updated));
            return updated;
        });
    }, []);

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

    return (
        <SettingsContext.Provider value={{
            currency,
            setCurrency,
            menuItems,
            toggleMenuItem,
            isMasterUser,
            formatCurrency
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
