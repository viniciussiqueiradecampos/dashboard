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
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';

interface SidebarProps {

}

const NAV_ITEMS = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Objetivos', icon: Target, path: '/goals' },
    { label: 'Cartões/Dinheiro', icon: CreditCard, path: '/cards' },
    { label: 'Transações', icon: ArrowRightLeft, path: '/transactions' },
    { label: 'Perfil', icon: User, path: '/profile' },
];

export function Sidebar({ }: SidebarProps) {
    const { isCollapsed, toggleSidebar } = useSidebar();
    const { user, signOut } = useAuth();
    const location = useLocation();

    // const toggleSidebar = () => setIsCollapsed(!isCollapsed); // Removido pois vem do context agora

    const SidebarContent = (
        <div className={cn(
            "flex flex-col h-screen bg-neutral-0 text-neutral-1100 transition-all duration-300 ease-in-out border-r border-neutral-200 relative z-50",
            isCollapsed ? "w-20" : "w-[300px]"
        )}>
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-12 bg-neutral-0 border border-neutral-200 text-neutral-600 rounded-full p-1 shadow-md hover:text-brand-900 hover:border-brand-500 transition-colors"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Logo Area */}
            <div className={cn(
                "flex items-center h-20 px-6 border-b border-neutral-100",
                isCollapsed ? "justify-center px-0" : "justify-between"
            )}>
                <div className="flex items-center gap-2 overflow-hidden">
                    {/* Logo Icon */}
                    <div className="bg-brand-500 p-1.5 rounded-lg shrink-0 flex items-center justify-center">
                        <span className="font-bold text-lg text-neutral-1100">m+</span>
                    </div>

                    {!isCollapsed && (
                        <div className="flex items-baseline">
                            <span className="font-medium text-2xl text-neutral-1100 tracking-tight">my</span>
                            <span className="font-bold text-2xl text-neutral-1100 tracking-tight">cash</span>
                            <span className="font-bold text-2xl text-brand-600 ml-0.5">+</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-14 px-4 space-y-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;

                    const LinkContent = (
                        <NavLink
                            to={item.path}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group relative overflow-hidden",
                                // Active State: #D7FF00 Background, #080B12 Text
                                isActive
                                    ? "bg-[#D7FF00] text-[#080B12] shadow-sm ring-1 ring-[#D7FF00]"
                                    : "hover:bg-neutral-100 hover:text-neutral-900 text-neutral-600",
                                isCollapsed && "justify-center px-0 py-3"
                            )}
                        >
                            {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#080B12] rounded-r-full" />}
                            <item.icon
                                size={22}
                                className={cn(
                                    "shrink-0 transition-colors",
                                    isActive ? "text-[#080B12]" : "text-neutral-500 group-hover:text-neutral-700"
                                )}
                            />
                            {!isCollapsed && (
                                <span className={cn("font-medium", isActive && "text-[#080B12] font-semibold")}>
                                    {item.label}
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
                                    <p>{item.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    }

                    return <div key={item.path}>{LinkContent}</div>;
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-neutral-100">
                <button
                    onClick={signOut}
                    className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-2xl transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer overflow-hidden border border-transparent hover:border-red-100 text-neutral-600",
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    <div className="relative shrink-0">
                        {/* Avatar placeholder or user avatar if available */}
                        <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 font-bold border-2 border-white shadow-sm">
                            {user?.user_metadata?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </div>

                    {!isCollapsed && (
                        <div className="flex flex-col min-w-0 text-left">
                            <span className="text-sm font-bold text-neutral-900 truncate">
                                {user?.user_metadata?.name || 'Usuário'}
                            </span>
                            <span className="text-xs text-neutral-500 truncate">Sair da conta</span>
                        </div>
                    )}

                    {!isCollapsed && (
                        <LogOut size={18} className="ml-auto opacity-70" />
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <TooltipProvider>
            {SidebarContent}
        </TooltipProvider>
    )
}
