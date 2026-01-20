import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { ExpensesByCategoryCarousel } from '@/components/dashboard/ExpensesByCategoryCarousel';
import { FinancialFlowChart } from '@/components/dashboard/FinancialFlowChart';
import { CreditCardsWidget } from '@/components/dashboard/CreditCardsWidget';
import { UpcomingExpensesWidget } from '@/components/dashboard/UpcomingExpensesWidget';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';

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

            {/* Right Column (Side Widgets - 1/3) - Aligned to top */}
            <div className="flex flex-col gap-8 self-start">
                {/* Cards Widget (Prompt 09) */}
                <CreditCardsWidget />

                {/* Upcoming Expenses Widget (Prompt 10) */}
                <UpcomingExpensesWidget />
            </div>
        </div>

        {/* Bottom Section - Full Width Table (Prompt 11) */}
        <div className="mt-8 mb-8 w-full">
            <TransactionsTable />
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
