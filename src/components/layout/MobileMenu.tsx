import { useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
    Home,
    Target,
    CreditCard,
    ArrowRightLeft,
    User,
    LogOut,
    X
} from 'lucide-react';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const NAV_ITEMS = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Objetivos', icon: Target, path: '/goals' },
    { label: 'Cartões', icon: CreditCard, path: '/cards' },
    { label: 'Transações', icon: ArrowRightLeft, path: '/transactions' },
    { label: 'Perfil', icon: User, path: '/profile' },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-neutral-1100/50 backdrop-blur-sm z-40 transition-opacity" aria-hidden="true" />

            {/* Dropdown Menu */}
            <div
                ref={menuRef}
                className="fixed top-0 left-0 right-0 bg-white rounded-b-3xl shadow-xl z-50 animate-in slide-in-from-top duration-300 ease-out flex flex-col pt-safe-top"
            >
                {/* Header inside Menu */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                        <div className="bg-brand-500 p-1.5 rounded-lg shrink-0 flex items-center justify-center">
                            <span className="font-bold text-lg text-neutral-1100">m+</span>
                        </div>
                        <span className="font-bold text-xl text-neutral-900">Menu</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors"
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-4 rounded-xl transition-all active:scale-[0.98]",
                                    isActive
                                        ? "bg-[#D7FF00] text-[#080B12] shadow-sm ring-1 ring-[#D7FF00]"
                                        : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                                )}
                            >
                                <item.icon size={24} className={isActive ? "text-[#080B12]" : "text-neutral-500"} />
                                <span className={cn("font-medium text-lg", isActive && "font-bold")}>{item.label}</span>
                                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-[#080B12]" />}
                            </NavLink>
                        )
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 rounded-b-3xl">
                    <button
                        onClick={() => { console.log('logout'); onClose(); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                    >
                        <LogOut size={22} />
                        <span>Sair da conta</span>
                    </button>
                </div>
            </div>
        </>
    );
}
