import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';

export function Transactions() {
    return (
        <div className="flex flex-col w-full h-full">
            <DashboardHeader />
            <div className="flex-1 mt-4">
                <TransactionsTable />
            </div>
        </div>
    );
}
