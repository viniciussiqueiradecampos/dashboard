import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
    Home,
    Target,
    CreditCard,
    ArrowRightLeft,
    User,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Sun,
    Moon,
    Settings,
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { EditProfileModal } from '@/components/modals/EditProfileModal';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'goals', label: 'Objetivos', icon: Target, path: '/goals' },
    { id: 'cards', label: 'Cartões/Dinheiro', icon: CreditCard, path: '/cards' },
    { id: 'transactions', label: 'Transações', icon: ArrowRightLeft, path: '/transactions' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
    { id: 'settings', label: 'Configurações', icon: Settings, path: '/settings', masterOnly: true },
];

export function Sidebar() {
    const { user, signOut } = useAuth();
    const { isCollapsed, toggleSidebar } = useSidebar();
    const { theme, toggleTheme } = useTheme();
    const { isMasterUser, menuItems } = useSettings();
    const { t } = useLanguage();
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Filter nav items based on settings and master user status
    const visibleNavItems = NAV_ITEMS.map(item => {
        const menuConfig = menuItems.find(m => m.id === item.id);
        const label = menuConfig
            ? (menuConfig.name !== menuConfig.originalName ? menuConfig.name : t(menuConfig.originalName))
            : t(item.label);

        return {
            ...item,
            displayLabel: label,
            enabled: menuConfig ? menuConfig.enabled : true
        };
    }).filter(item => {
        if ((item as any).masterOnly && !isMasterUser) return false;
        return item.enabled;
    });

    const SidebarContent = (
        <div className={cn(
            "hidden lg:flex flex-col h-screen bg-neutral-0 dark:bg-neutral-900 text-neutral-1100 dark:text-white transition-all duration-300 ease-in-out border-r border-neutral-200 dark:border-neutral-800 relative z-50",
            isCollapsed ? "w-20" : "w-[300px]"
        )}>
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="hidden lg:flex absolute -right-3 top-12 bg-neutral-0 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full p-1 shadow-md hover:text-brand-900 dark:hover:text-[#D7FF00] hover:border-brand-500 transition-colors"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Logo Area */}
            <div className={cn(
                "flex items-center h-20 px-6 border-b border-neutral-100 dark:border-neutral-800",
                isCollapsed ? "justify-center px-0" : "justify-between"
            )}>
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="bg-neutral-1100 dark:bg-[#D7FF00] p-1.5 rounded-lg shrink-0 flex items-center justify-center">
                        <span className="font-bold text-lg text-white dark:text-[#080B12]">m+</span>
                    </div>

                    {!isCollapsed && (
                        <div className="flex items-baseline">
                            <span className="font-medium text-2xl text-neutral-1100 dark:text-white tracking-tight">my</span>
                            <span className="font-bold text-2xl text-neutral-1100 dark:text-white tracking-tight">cash</span>
                            <span className="font-bold text-2xl text-neutral-600 dark:text-[#D7FF00] ml-0.5">+</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-14 px-4 space-y-2">
                {visibleNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const label = item.displayLabel;

                    const LinkContent = (
                        <NavLink
                            to={item.path}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-[#D7FF00] text-[#080B12] shadow-sm ring-1 ring-[#D7FF00]"
                                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white text-neutral-600 dark:text-neutral-400",
                                isCollapsed && "justify-center px-0 py-3"
                            )}
                        >
                            {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#080B12] rounded-r-full" />}
                            <item.icon
                                size={22}
                                className={cn(
                                    "shrink-0 transition-colors",
                                    isActive ? "text-[#080B12]" : "text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-200"
                                )}
                            />
                            {!isCollapsed && (
                                <span className={cn("font-medium", isActive && "text-[#080B12] font-semibold")}>
                                    {label}
                                </span>
                            )}
                        </NavLink>
                    );

                    if (isCollapsed) {
                        return (
                            <Tooltip key={item.path} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    {LinkContent}
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-neutral-900 text-white border-neutral-800 ml-2">
                                    <p>{label}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    }

                    return <div key={item.path}>{LinkContent}</div>;
                })}
            </nav>

            {/* Theme Toggle & Logout Section */}
            <div className="p-4 space-y-4 border-t border-neutral-100 dark:border-neutral-800">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    {theme === 'light' ? (
                        <>
                            <Moon size={20} className="shrink-0" />
                            {!isCollapsed && <span className="font-medium">{t('Modo Escuro')}</span>}
                        </>
                    ) : (
                        <>
                            <Sun size={20} className="shrink-0 text-[#D7FF00]" />
                            {!isCollapsed && <span className="font-medium text-white">{t('Modo Claro')}</span>}
                        </>
                    )}
                </button>

                {/* Profile Button */}
                <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-2xl transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 overflow-hidden border border-transparent text-neutral-600 dark:text-neutral-400 group",
                        isCollapsed ? "justify-center" : ""
                    )}
                    title={t('Editar Perfil')}
                >
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-300 font-bold border-2 border-white dark:border-neutral-800 shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.user_metadata?.name?.[0]?.toUpperCase() || 'U'
                            )}
                        </div>
                    </div>

                    {!isCollapsed && (
                        <div className="flex flex-col min-w-0 text-left">
                            <span className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                                {user?.user_metadata?.name || 'Usuário'}
                            </span>
                            <span className="text-xs text-neutral-500 truncate">{t('Editar Perfil')}</span>
                        </div>
                    )}
                </button>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-2xl transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 text-neutral-600 dark:text-neutral-400",
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    <LogOut size={20} className="shrink-0" />
                    {!isCollapsed && <span className="font-medium">{t('Sair')}</span>}
                </button>
            </div>

            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
            />
        </div>
    );

    const BottomNav = (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#080B12] border-t border-neutral-200 dark:border-neutral-800 px-2 pb-6 pt-2">
            <div className="flex items-center justify-around">
                {visibleNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-16",
                                isActive
                                    ? "text-[#D7FF00]"
                                    : "text-neutral-500 dark:text-neutral-400"
                            )}
                        >
                            <item.icon
                                size={24}
                                className={cn(
                                    "transition-colors",
                                    isActive ? "text-[#D7FF00]" : "text-neutral-500 dark:text-neutral-400"
                                )}
                            />
                            <span className={cn(
                                "text-[10px] font-medium uppercase tracking-tight",
                                isActive ? "text-[#D7FF00]" : "text-neutral-500 dark:text-neutral-400"
                            )}>
                                {item.displayLabel.split(' ')[0]}
                            </span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );

    return (
        <TooltipProvider>
            {SidebarContent}
            {BottomNav}
            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
            />
        </TooltipProvider>
    )
}

