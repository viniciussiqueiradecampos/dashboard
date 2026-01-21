import { Wallet, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { useSettings } from '@/contexts/SettingsContext';
import { NewTransactionModal } from '@/components/modals/NewTransactionModal';
import { cn } from '@/utils/cn';
import { Transaction } from '@/types';



interface ExpenseItemProps {
    expense: Transaction;
    onMarkAsPaid: (id: string) => void;
    getAccountName: (transaction: Transaction) => string;
}

function ExpenseItem({ expense, onMarkAsPaid, getAccountName }: ExpenseItemProps) {
    const { formatCurrency, t } = useSettings();
    const [isHovered, setIsHovered] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const formatDueDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${t('Vencimento')} ${day}/${month}`;
    };

    const handleMarkAsPaid = async () => {
        setIsPaying(true);
        // Simulate minor delay for UX
        await new Promise(resolve => setTimeout(resolve, 300));
        onMarkAsPaid(expense.id);
    };

    return (
        <div className="flex items-center justify-between py-4 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 group/item transition-colors duration-300">
            {/* Left: Expense Info */}
            <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-[15px] font-bold text-neutral-1100 dark:text-white mb-1 truncate transition-colors">
                    {expense.description}
                </h4>
                <p className="text-[13px] text-neutral-600 dark:text-neutral-400 font-medium mb-0.5 transition-colors">
                    {formatDueDate(expense.date)}
                </p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium transition-colors">
                    {getAccountName(expense)}
                </p>
            </div>

            {/* Right: Amount and Action */}
            <div className="flex items-center gap-4 shrink-0">
                <p className="text-[16px] font-bold text-neutral-1100 dark:text-white whitespace-nowrap transition-colors">
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
                            ? "bg-green-50 dark:bg-green-900/30 border-green-600 text-green-600 dark:text-green-500"
                            : "bg-transparent border-neutral-300 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-500"
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
    const { transactions, updateTransaction, bankAccounts, creditCards } = useFinance();
    const { t } = useSettings();
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 2;

    const allUpcomingExpenses = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return transactions
            .filter(t => t.type === 'expense' && t.status === 'pending')
            .filter(t => {
                const dueDate = new Date(t.date);
                return dueDate >= today;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [transactions]);

    const totalPages = Math.ceil(allUpcomingExpenses.length / itemsPerPage);
    const currentExpenses = allUpcomingExpenses.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const nextPage = () => setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));

    const handleMarkAsPaid = (id: string) => {
        updateTransaction(id, { status: 'completed' });
    };

    const getAccountName = (transaction: Transaction) => {
        if (transaction.accountId) {
            const account = bankAccounts.find((a) => a.id === transaction.accountId);
            return account ? `${account.bankName} - ${account.name}` : 'Conta';
        }
        if (transaction.cardId) {
            const card = creditCards.find((c) => c.id === transaction.cardId);
            return card ? `${card.brand} ${card.name}` : 'Cartão';
        }
        return 'N/A';
    };

    return (
        <>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-[32px] p-6 h-full flex flex-col shadow-sm transition-colors duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl transition-colors">
                            <Wallet size={20} className="text-neutral-1100 dark:text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-1100 dark:text-white tracking-tight transition-colors">
                            {t('Transações Recorrentes')}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsTransactionModalOpen(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-1100 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:scale-110 transition-all shadow-sm"
                            title={t('Adicionar Despesa')}
                        >
                            <Plus size={20} />
                        </button>
                        {totalPages > 1 && (
                            <div className="flex items-center ml-2 border border-neutral-200 dark:border-neutral-700 rounded-full bg-white dark:bg-neutral-800 p-1 shadow-sm transition-colors">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 0}
                                    className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 px-1">
                                    {currentPage + 1}/{totalPages}
                                </span>
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages - 1}
                                    className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Expenses List */}
                <div className="flex-1 overflow-y-auto px-1">
                    {currentExpenses.length > 0 ? (
                        <div className="space-y-0">
                            {currentExpenses.map((expense) => (
                                <ExpenseItem
                                    key={expense.id}
                                    expense={expense}
                                    onMarkAsPaid={handleMarkAsPaid}
                                    getAccountName={getAccountName}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl py-12 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 border-2 border-green-600 flex items-center justify-center mb-4">
                                <Check size={32} className="text-green-600 dark:text-green-500" />
                            </div>
                            <p className="text-sm text-neutral-400 font-medium">
                                {t('Nenhuma despesa pendente')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <NewTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
            />
        </>
    );
}
