import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { ExpensesByCategoryCarousel } from '@/components/dashboard/ExpensesByCategoryCarousel';
import { FinancialFlowChart } from '@/components/dashboard/FinancialFlowChart';
import { CreditCardsWidget } from '@/components/dashboard/CreditCardsWidget';
import { UpcomingExpensesWidget } from '@/components/dashboard/UpcomingExpensesWidget';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';

export function Dashboard() {
    return (
        <div className="flex flex-col w-full">
            <DashboardHeader />

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Main Content - 2/3) */}
                <div className="lg:col-span-2 space-y-8 flex flex-col">
                    {/* Category Carousel */}
                    <ExpensesByCategoryCarousel />

                    {/* Summary Cards */}
                    <SummaryCards />

                    {/* Financial Flow Section */}
                    <FinancialFlowChart />
                </div>

                {/* Right Column (Side Widgets - 1/3) */}
                <div className="flex flex-col gap-6 self-start h-full">
                    {/* Cards Widget */}
                    <CreditCardsWidget />

                    {/* Upcoming Expenses Widget */}
                    <div className="flex-1 min-h-0">
                        <UpcomingExpensesWidget />
                    </div>
                </div>
            </div>

            {/* Bottom Section - Full Width Table */}
            <div className="mt-8 mb-8 w-full">
                <TransactionsTable />
            </div>
        </div>
    );
}
