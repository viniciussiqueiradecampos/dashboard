import { useFinance } from '@/contexts/FinanceContext';
import { Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SummaryCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    iconColor: string;
    bgColor?: string;
}

function SummaryCard({ title, value, icon: Icon, iconColor, bgColor = "bg-white" }: SummaryCardProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(val);
    };

    return (
        <div className={cn(
            "flex flex-col p-8 rounded-[20px] border border-neutral-300 shadow-sm transition-all hover:shadow-md h-[206px] justify-between",
            bgColor
        )}>
            <div className={cn(
                "p-3 rounded-2xl w-fit flex items-center justify-center bg-neutral-100",
            )}>
                <Icon size={24} style={{ color: iconColor }} />
            </div>

            <div className="flex flex-col gap-1">
                <p className="text-[18px] text-neutral-500 font-medium">
                    {title}
                </p>
                <h3 className="text-[28px] font-bold text-neutral-1100 tracking-tight">
                    {formatCurrency(value)}
                </h3>
            </div>
        </div>
    );
}

export function SummaryCards() {
    const { totalBalance, incomeForPeriod, expensesForPeriod } = useFinance();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 w-full max-w-[794px]">
            <SummaryCard
                title="Saldo Total"
                value={totalBalance}
                icon={Wallet}
                iconColor="#2a89ef" // blue-600
            />
            <SummaryCard
                title="Receitas"
                value={incomeForPeriod}
                icon={ArrowUpCircle}
                iconColor="#15be78" // green-600
            />
            <SummaryCard
                title="Despesas"
                value={expensesForPeriod}
                icon={ArrowDownCircle}
                iconColor="#e61e32" // red-600
            />
        </div>
    );
}
