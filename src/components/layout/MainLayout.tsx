import { Sidebar } from '@/components/layout/Sidebar';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
    return (
        <div className="flex min-h-screen bg-neutral-200 font-sans">
            {/* Sidebar is fixed on desktop, hidden logic for mobile to be added with Context later if needed, currently CSS handled */}
            <aside className="hidden lg:block shrink-0 sticky top-0 h-screen z-40">
                <Sidebar />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 w-full min-w-0 overflow-x-hidden">
                {/* Helper Wrapper for centering/constraining if needed, but per rules: width 100% */}
                <div className="w-full h-full p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
