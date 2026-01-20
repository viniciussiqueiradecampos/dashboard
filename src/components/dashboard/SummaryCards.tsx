import { useFinance } from '@/contexts/FinanceContext';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SummaryCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    variant?: 'default' | 'brand' | 'success' | 'danger';
    trend?: {
        value: number;
        isUp: boolean;
    };
}

function SummaryCard({ title, value, icon: Icon, variant = 'default', trend }: SummaryCardProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(val);
    };

    const variants = {
        default: "bg-white border-neutral-200 text-neutral-1100",
        brand: "bg-[#D7FF00] border-[#C0E600] text-neutral-1100",
        success: "bg-green-50 border-green-100 text-green-900",
        danger: "bg-red-50 border-red-100 text-red-900",
    };

    return (
        <div className={cn(
            "p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md group",
            variants[variant]
        )}>
            <div className="flex items-start justify-between mb-4">
                <div className={cn(
                    "p-3 rounded-2xl transition-colors",
                    variant === 'brand' ? "bg-black/10" : "bg-neutral-100 group-hover:bg-neutral-200"
                )}>
                    <Icon size={24} className={variant === 'brand' ? "text-black" : "text-neutral-500"} />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                        trend.isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {trend.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trend.value}%
                    </div>
                )}
            </div>

            <p className={cn(
                "text-sm font-medium mb-1",
                variant === 'brand' ? "text-neutral-900" : "text-neutral-500"
            )}>
                {title}
            </p>
            <h3 className="text-2xl font-bold tracking-tight">
                {formatCurrency(value)}
            </h3>
        </div>
    );
}

export function SummaryCards() {
    const { totalBalance, incomeForPeriod, expensesForPeriod, goals } = useFinance();

    // Simple logic for main goal progress
    const mainGoal = goals[0]; // Assuming first goal is main for now

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard
                title="Saldo Total"
                value={totalBalance}
                icon={Wallet}
                trend={{ value: 12, isUp: true }}
            />
            <SummaryCard
                title="Receitas"
                value={incomeForPeriod}
                icon={ArrowUpCircle}
                trend={{ value: 8, isUp: true }}
            />
            <SummaryCard
                title="Despesas"
                value={expensesForPeriod}
                icon={ArrowDownCircle}
                trend={{ value: 5, isUp: false }}
            />
            <SummaryCard
                title={mainGoal?.name || "Meta de Economia"}
                value={mainGoal?.currentAmount || 0}
                icon={Target}
                variant="brand"
            />
        </div>
    );
}
