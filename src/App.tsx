import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { ExpensesByCategoryCarousel } from '@/components/dashboard/ExpensesByCategoryCarousel';
import { FinancialFlowChart } from '@/components/dashboard/FinancialFlowChart';

// Placeholder Pages - To be real components soon
const DashboardMock = () => (
    <div className="flex flex-col w-full">
        <DashboardHeader />

        {/* Category Carousel (Prompt 7) */}
        <ExpensesByCategoryCarousel />

        {/* Summary Cards (Prompt 5) */}
        <SummaryCards />

        {/* Financial Flow Section (Prompt 8) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
            <div className="lg:col-span-2">
                <FinancialFlowChart />
            </div>
            <div className="h-full bg-white rounded-[32px] shadow-sm border border-neutral-300 p-8">
                <h2 className="text-xl font-bold text-neutral-1100 mb-6">Transações Recentes</h2>
                <div className="space-y-4">
                    {/* Placeholder for Recent Transactions (Prompt 9) */}
                    <div className="h-20 bg-neutral-50 rounded-2xl animate-pulse" />
                    <div className="h-20 bg-neutral-50 rounded-2xl animate-pulse" />
                    <div className="h-20 bg-neutral-50 rounded-2xl animate-pulse" />
                </div>
            </div>
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
