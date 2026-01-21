import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { Transactions } from '@/pages/Transactions';
import { Cards } from '@/pages/Cards';
import { Goals } from '@/pages/Goals';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { Loader2 } from 'lucide-react';

import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function ProtectedLayout() {
    const { user, loading } = useAuth();
    const { theme } = useTheme();

    if (loading) {
        return (
            <div className={cn(
                "h-screen w-full flex items-center justify-center transition-colors duration-300",
                theme === 'dark' ? 'bg-[#080B12]' : 'bg-neutral-100'
            )}>
                <Loader2 className="animate-spin text-neutral-400" size={40} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <SettingsProvider>
            <FinanceProvider>
                <SidebarProvider>
                    <div className={cn(
                        "flex h-screen overflow-hidden transition-colors duration-300",
                        theme === 'dark' ? 'bg-[#080B12]' : 'bg-neutral-100'
                    )}>
                        <Sidebar />
                        <main className="flex-1 overflow-y-auto p-4 lg:p-8 ml-0 lg:ml-20 transition-all duration-300">
                            <div className="max-w-7xl mx-auto h-full">
                                <Outlet />
                            </div>
                        </main>
                    </div>
                </SidebarProvider>
            </FinanceProvider>
        </SettingsProvider>
    );
}

function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <Router>
                    <AuthProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route element={<ProtectedLayout />}>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/transactions" element={<Transactions />} />
                                <Route path="/goals" element={<Goals />} />
                                <Route path="/cards" element={<Cards />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/settings" element={<Settings />} />
                            </Route>
                        </Routes>
                    </AuthProvider>
                </Router>
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;
