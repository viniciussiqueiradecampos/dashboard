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
