import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Plus, CreditCard as CardIcon } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { ExpensesByCategoryCarousel } from '@/components/dashboard/ExpensesByCategoryCarousel';
import { FinancialFlowChart } from '@/components/dashboard/FinancialFlowChart';
import { CreditCardsWidget } from '@/components/dashboard/CreditCardsWidget';

// Placeholder Pages - To be real components soon
const DashboardMock = () => (
    <div className="flex flex-col w-full">
        <DashboardHeader />

        {/* Main Grid Layout - Matching FIGMA exactly */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Main Content - 2/3) */}
            <div className="lg:col-span-2 space-y-8 flex flex-col">
                {/* Category Carousel (Prompt 7) */}
                <ExpensesByCategoryCarousel />

                {/* Summary Cards (Prompt 5) */}
                <SummaryCards />

                {/* Financial Flow Section (Prompt 8) */}
                <FinancialFlowChart />
            </div>

            {/* Right Column (Side Widgets - 1/3) */}
            <div className="flex flex-col gap-8">
                {/* Cards Widget (Prompt 09) */}
                <CreditCardsWidget />

                {/* Proximas Despesas Placeholder (Prompt 10) */}
                <div className="bg-white border border-neutral-300 rounded-[32px] p-8 min-h-[460px] flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-neutral-100 rounded-xl">
                                <CardIcon size={22} className="text-neutral-1100" />
                            </div>
                            <h2 className="text-xl font-bold text-neutral-1100 tracking-tight">Próximas despesas</h2>
                        </div>
                        <Plus className="text-neutral-400 cursor-pointer hover:text-black transition-colors" size={24} />
                    </div>
                    <div className="flex-1 border-2 border-dashed border-neutral-100 rounded-3xl flex items-center justify-center text-neutral-400 font-medium text-sm text-center px-4">
                        Lista de Despesas Futuras (Implementação Prompt 10)
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Section - Full Width Table */}
        <div className="mt-8 mb-8 w-full">
            <div className="bg-white rounded-[32px] shadow-sm border border-neutral-300 p-8 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-neutral-1100 tracking-tight">Extrato detalhado</h2>
                </div>
                <div className="flex-1 border-2 border-dashed border-neutral-100 rounded-3xl flex items-center justify-center text-neutral-400 font-medium">
                    Tabela de Transações Completa (Próximo Passo)
                </div>
            </div>
        </div>
    </div>
);

const GoalsMock = () => <div className="text-2xl font-bold p-8">Objetivos</div>;
const CardsMock = () => <div className="text-2xl font-bold p-8">Cartões</div>;
const TransactionsMock = () => <div className="text-2xl font-bold p-8">Transações</div>;
const ProfileMock = () => <div className="text-2xl font-bold p-8">Perfil</div>;

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
