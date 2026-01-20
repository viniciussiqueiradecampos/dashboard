import { Sidebar } from '@/components/layout/Sidebar';
import { HeaderMobile } from '@/components/layout/HeaderMobile';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
    return (
        <div className="flex min-h-screen bg-neutral-200 font-sans">
            {/* Sidebar Desktop (Visible >= 1024px) */}
            <aside className="hidden lg:block shrink-0 sticky top-0 h-screen z-40">
                <Sidebar />
            </aside>

            {/* Mobile Header (Visible < 1024px) */}
            <HeaderMobile />

            {/* Main Content Area */}
            <main className="flex-1 w-full min-w-0 overflow-x-hidden pt-16 lg:pt-0">
                {/* 
           pt-16 creates space for fixed mobile header (h-16).
           lg:pt-0 removes it on desktop where sidebar handles navigation.
        */}
                <div className="w-full h-full p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
