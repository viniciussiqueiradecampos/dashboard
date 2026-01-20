import { useState } from 'react';
import { MobileMenu } from './MobileMenu';
import { Menu } from 'lucide-react';

export function HeaderMobile() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 px-4 flex items-center justify-between z-40 shadow-sm">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="bg-brand-500 p-1.5 rounded-lg shrink-0 flex items-center justify-center">
                        <span className="font-bold text-lg text-neutral-1100">m+</span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="font-medium text-xl text-neutral-1100 tracking-tight">my</span>
                        <span className="font-bold text-xl text-neutral-1100 tracking-tight">cash</span>
                        <span className="font-bold text-xl text-brand-600 ml-0.5">+</span>
                    </div>
                </div>

                {/* Avatar Trigger */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full"
                    aria-label="Open menu"
                >
                    <img
                        src="https://github.com/viniciussiqueiradecampos.png"
                        alt="User Profile"
                        className="w-10 h-10 rounded-full border-2 border-neutral-100 object-cover aspect-square shadow-sm group-active:scale-95 transition-transform"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-neutral-1100 text-white p-1 rounded-full border-2 border-white">
                        <Menu size={10} />
                    </div>
                </button>
            </header>

            {/* Dropdown Menu Component */}
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
