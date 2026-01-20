
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { Transactions } from '@/pages/Transactions';
import { Cards } from '@/pages/Cards';
import { Goals } from '@/pages/Goals';
import { Profile } from '@/pages/Profile';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { Loader2 } from 'lucide-react';

function ProtectedLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#F1F5F9]">
                <Loader2 className="animate-spin text-neutral-400" size={40} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <FinanceProvider>
            <SidebarProvider>
                <div className="flex h-screen bg-[#F1F5F9] overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto p-4 lg:p-8 ml-0 lg:ml-20 transition-all duration-300">
                        <div className="max-w-7xl mx-auto h-full">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </SidebarProvider>
        </FinanceProvider>
    );
}

function App() {
    return (
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
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
