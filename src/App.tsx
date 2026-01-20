import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

// Placeholder Pages - To be real components soon
const DashboardMock = () => (
    <div className="flex flex-col w-full">
        <DashboardHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for Widgets (Prompt 5) */}
            <div className="h-32 bg-white rounded-3xl shadow-sm border border-neutral-200 p-6">Saldo</div>
            <div className="h-32 bg-white rounded-3xl shadow-sm border border-neutral-200 p-6">Receitas</div>
            <div className="h-32 bg-white rounded-3xl shadow-sm border border-neutral-200 p-6">Despesas</div>
            <div className="h-32 bg-[#D7FF00] rounded-3xl shadow-sm border border-[#C0E600] p-6 text-neutral-1100">Meta</div>
        </div>

        {/* Large placeholder for chart/list area */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[400px] bg-white rounded-3xl shadow-sm border border-neutral-200 p-6">Gráfico de Evolução</div>
            <div className="h-[400px] bg-white rounded-3xl shadow-sm border border-neutral-200 p-6">Transações Recentes</div>
        </div>
    </div>
);

const GoalsMock = () => <div className="text-2xl font-bold">Objetivos</div>;
const CardsMock = () => <div className="text-2xl font-bold">Cartões</div>;
const TransactionsMock = () => <div className="text-2xl font-bold">Transações</div>;
const ProfileMock = () => <div className="text-2xl font-bold">Perfil</div>;

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardMock />} />
                    <Route path="/goals" element={<GoalsMock />} />
                    <Route path="/cards" element={<CardsMock />} />
                    <Route path="/transactions" element={<TransactionsMock />} />
                    <Route path="/profile" element={<ProfileMock />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
