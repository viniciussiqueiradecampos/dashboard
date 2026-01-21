import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useSettings, Currency } from '@/contexts/SettingsContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { DollarSign, Globe, Menu, Shield, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
    { value: 'BRL', label: 'Real Brasileiro', symbol: 'R$' },
    { value: 'USD', label: 'US Dollar', symbol: '$' },
    { value: 'EUR', label: 'Euro', symbol: '€' },
    { value: 'GBP', label: 'British Pound', symbol: '£' },
];

const LANGUAGES: { value: Language; label: string; flag: string }[] = [
    { value: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷' },
    { value: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
];

export function Settings() {
    const { currency, setCurrency, menuItems, toggleMenuItem, isMasterUser } = useSettings();
    const { language, setLanguage, t } = useLanguage();

    if (!isMasterUser) {
        return (
            <div className="flex flex-col w-full h-full">
                <DashboardHeader />

                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-md px-4">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Shield size={32} className="text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                            {language === 'pt-BR' ? 'Acesso Restrito' : 'Restricted Access'}
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            {language === 'pt-BR'
                                ? 'Esta página é acessível apenas pelo administrador do sistema.'
                                : 'This page is only accessible by the system administrator.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full">
            <DashboardHeader />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-1100 dark:text-white transition-colors">
                        {t('settings.title')}
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 transition-colors">
                        {language === 'pt-BR'
                            ? 'Configure as preferências do sistema'
                            : 'Configure system preferences'
                        }
                    </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
                    <AlertCircle size={16} />
                    <span>{language === 'pt-BR' ? 'Modo Administrador' : 'Admin Mode'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Currency Settings */}
                <div className="bg-white dark:bg-neutral-900 rounded-[24px] border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <DollarSign size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{t('settings.currency')}</h3>
                    </div>

                    <div className="space-y-2">
                        {CURRENCIES.map((curr) => (
                            <button
                                key={curr.value}
                                onClick={() => setCurrency(curr.value)}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-xl transition-all",
                                    currency === curr.value
                                        ? "bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-[#D7FF00]"
                                        : "bg-neutral-50 dark:bg-neutral-800/50 border-2 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-bold text-neutral-900 dark:text-white">{curr.symbol}</span>
                                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{curr.label}</span>
                                </div>
                                {currency === curr.value && (
                                    <div className="w-6 h-6 bg-neutral-900 dark:bg-[#D7FF00] rounded-full flex items-center justify-center">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-black" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Language Settings */}
                <div className="bg-white dark:bg-neutral-900 rounded-[24px] border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Globe size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{t('settings.language')}</h3>
                    </div>

                    <div className="space-y-2">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.value}
                                onClick={() => setLanguage(lang.value)}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-xl transition-all",
                                    language === lang.value
                                        ? "bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-[#D7FF00]"
                                        : "bg-neutral-50 dark:bg-neutral-800/50 border-2 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{lang.label}</span>
                                </div>
                                {language === lang.value && (
                                    <div className="w-6 h-6 bg-neutral-900 dark:bg-[#D7FF00] rounded-full flex items-center justify-center">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-black" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Items Settings */}
                <div className="bg-white dark:bg-neutral-900 rounded-[24px] border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <Menu size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{t('settings.menuItems')}</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {language === 'pt-BR'
                                    ? 'Ative ou desative itens do menu lateral'
                                    : 'Enable or disable sidebar menu items'
                                }
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => toggleMenuItem(item.id)}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-xl transition-all",
                                    item.enabled
                                        ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500"
                                        : "bg-neutral-50 dark:bg-neutral-800/50 border-2 border-neutral-200 dark:border-neutral-700"
                                )}
                            >
                                <span className={cn(
                                    "font-medium",
                                    item.enabled
                                        ? "text-green-700 dark:text-green-400"
                                        : "text-neutral-500 dark:text-neutral-400"
                                )}>
                                    {item.name}
                                </span>
                                <div className={cn(
                                    "w-12 h-6 rounded-full transition-colors relative",
                                    item.enabled ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-600"
                                )}>
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                                        item.enabled ? "right-1" : "left-1"
                                    )} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
