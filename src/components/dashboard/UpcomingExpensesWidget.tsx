import { Wallet, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

interface UpcomingExpense {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
    paymentSource: {
        type: 'account' | 'card';
        name: string;
        last4?: string;
    };
    isRecurring?: boolean;
    installment?: {
        current: number;
        total: number;
    };
}

// Mock data - will be replaced with real data from context
const mockExpenses: UpcomingExpense[] = [
    {
        id: '1',
        description: 'Conta de Luz',
        amount: 154.00,
        dueDate: '2026-01-21',
        paymentSource: {
            type: 'card',
            name: 'Nubank',
            last4: '5897'
        },
        isRecurring: true
    },
    {
        id: '2',
        description: 'Internet Fibra',
        amount: 99.90,
        dueDate: '2026-01-25',
        paymentSource: {
            type: 'account',
            name: 'Nubank'
        },
        isRecurring: true
    },
    {
        id: '3',
        description: 'Spotify Premium',
        amount: 21.90,
        dueDate: '2026-01-28',
        paymentSource: {
            type: 'card',
            name: 'Inter',
            last4: '5897'
        },
        isRecurring: true
    },
    {
        id: '4',
        description: 'Notebook Dell',
        amount: 450.00,
        dueDate: '2026-02-05',
        paymentSource: {
            type: 'card',
            name: 'Picpay',
            last4: '5897'
        },
        installment: {
            current: 3,
            total: 12
        }
    },
    {
        id: '5',
        description: 'Academia SmartFit',
        amount: 89.90,
        dueDate: '2026-02-10',
        paymentSource: {
            type: 'account',
            name: 'Inter'
        },
        isRecurring: true
    }
];

interface ExpenseItemProps {
    expense: UpcomingExpense;
    onMarkAsPaid: (id: string) => void;
}

function ExpenseItem({ expense, onMarkAsPaid }: ExpenseItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDueDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `Vence dia ${day}/${month}`;
    };

    const formatPaymentSource = () => {
        if (expense.paymentSource.type === 'account') {
            return `${expense.paymentSource.name} conta`;
        }
        return `Crédito ${expense.paymentSource.name} **** ${expense.paymentSource.last4}`;
    };

    const handleMarkAsPaid = async () => {
        setIsPaying(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        onMarkAsPaid(expense.id);
    };

    return (
        <div className="flex items-center justify-between py-6 border-b border-neutral-200 last:border-b-0 group/item">
            {/* Left: Expense Info */}
            <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-[15px] font-bold text-neutral-1100 mb-1 truncate">
                    {expense.description}
                </h4>
                <p className="text-[13px] text-neutral-600 font-medium mb-0.5">
                    {formatDueDate(expense.dueDate)}
                </p>
                <p className="text-[11px] text-neutral-400 font-medium">
                    {formatPaymentSource()}
                </p>
            </div>

            {/* Right: Amount and Action */}
            <div className="flex items-center gap-4 shrink-0">
                <p className="text-[16px] font-bold text-neutral-1100 whitespace-nowrap">
                    {formatCurrency(expense.amount)}
                </p>
                <button
                    onClick={handleMarkAsPaid}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    disabled={isPaying}
                    className={cn(
                        "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200",
                        isHovered || isPaying
                            ? "bg-green-50 border-green-600 text-green-600"
                            : "bg-transparent border-neutral-300 text-neutral-400 hover:border-neutral-400"
                    )}
                    title="Marcar como paga"
                >
                    <Check size={16} className={cn(
                        "transition-transform duration-200",
                        isPaying && "scale-110"
                    )} />
                </button>
            </div>
        </div>
    );
}

export function UpcomingExpensesWidget() {
    const [expenses, setExpenses] = useState<UpcomingExpense[]>(
        mockExpenses.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    );

    const handleMarkAsPaid = (id: string) => {
        // Animate removal
        setExpenses(prev => prev.filter(exp => exp.id !== id));

        // Show success message (you can implement a toast notification here)
        console.log('Despesa marcada como paga!');

        // TODO: Update backend, handle recurring/installment logic
    };

    return (
        <div className="bg-white border border-neutral-300 rounded-[32px] p-8 h-full flex flex-col shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-neutral-100 rounded-xl">
                        <Wallet size={20} className="text-neutral-1100" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-1100 tracking-tight">
                        Próximas despesas
                    </h2>
                </div>
                <button
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-1100 hover:bg-neutral-50 hover:scale-110 transition-all shadow-sm"
                    title="Adicionar despesa"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Expenses List */}
            <div className="flex-1 overflow-y-auto -mx-8 px-8">
                {expenses.length > 0 ? (
                    <div className="space-y-0">
                        {expenses.map((expense) => (
                            <ExpenseItem
                                key={expense.id}
                                expense={expense}
                                onMarkAsPaid={handleMarkAsPaid}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-neutral-200 rounded-3xl py-12">
                        <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-600 flex items-center justify-center mb-4">
                            <Check size={32} className="text-green-600" />
                        </div>
                        <p className="text-sm text-neutral-400 font-medium">
                            Nenhuma despesa pendente
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
