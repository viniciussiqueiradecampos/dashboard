import { CreditCard as CardIcon, Plus, ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { CreditCard, BankAccount } from '@/types';
import { CardDetailsModal } from '@/components/modals/CardDetailsModal';
import { AddAccountModal } from '@/components/modals/AddAccountModal';
import { EditAccountModal } from '@/components/modals/EditAccountModal';

interface CreditCardItemProps {
    card: CreditCard;
    onClick: () => void;
}

function CreditCardItem({ card, onClick }: CreditCardItemProps) {
    const usagePercentage = Math.round((card.currentInvoice / card.limit) * 100);
    const isOverLimit = usagePercentage >= 70;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const getThemeStyles = (themeName: string) => {
        switch (themeName) {
            case 'black':
                return { bg: 'bg-[#080B12]', icon: 'text-[#D7FF00]', badge: 'bg-[#D7FF00] text-[#080B12]' };
            case 'lime':
                return { bg: 'bg-[#D7FF00]', icon: 'text-[#080B12]', badge: 'bg-[#080B12] text-white' };
            default: // white
                return { bg: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700', icon: 'text-neutral-600 dark:text-neutral-400', badge: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-white' };
        }
    };

    const theme = getThemeStyles(card.theme);

    return (
        <div
            onClick={onClick}
            className="group bg-white dark:bg-neutral-900 p-5 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800 flex items-center gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
        >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden", theme.bg)}>
                {card.imageUrl ? (
                    <img src={card.imageUrl} alt={card.brand} className="w-full h-full object-cover" />
                ) : (
                    <CardIcon size={24} className={theme.icon} />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{card.brand} {card.name}</p>
                    <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors",
                        isOverLimit ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : theme.badge
                    )}>
                        {usagePercentage}%
                    </span>
                </div>
                <h4 className="text-lg font-bold text-neutral-1100 dark:text-white leading-tight mb-2">
                    {formatCurrency(card.currentInvoice)}
                </h4>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-1">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isOverLimit
                                ? "bg-red-500"
                                : card.theme === 'lime' ? 'bg-[#080B12] dark:bg-white' : 'bg-[#D7FF00]'
                        )}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between items-center text-[10px] font-medium">
                    <p className="text-neutral-400 dark:text-neutral-500">
                        •••• {card.last4Digits}
                    </p>
                    <p className="text-neutral-400 dark:text-neutral-500">
                        Limite: {formatCurrency(card.limit)}
                    </p>
                </div>
            </div>
        </div>
    );
}

interface AccountItemProps {
    account: any;
    isCash?: boolean;
    onClick: () => void;
}

function AccountItem({ account, isCash, onClick }: AccountItemProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency', currency: 'BRL',
        }).format(value);
    };

    return (
        <div
            onClick={onClick}
            className="group bg-white dark:bg-neutral-900 p-5 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800 flex items-center gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
        >
            <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                isCash ? "bg-[#D7FF00] text-[#080B12]" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            )}>
                {isCash ? <Plus size={24} /> : <LayoutDashboard size={24} />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-0.5">
                    {isCash ? 'Dinheiro em Espécie' : account.bankName}
                </p>
                <h4 className="text-lg font-bold text-neutral-1100 dark:text-white leading-tight">
                    {account.name}
                </h4>
            </div>
            <div className="text-right">
                <p className="text-[13px] font-bold text-green-600 dark:text-green-500">
                    {formatCurrency(account.balance)}
                </p>
            </div>
        </div>
    );
}

export function CreditCardsWidget() {
    const { creditCards, bankAccounts, transactions } = useFinance();
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const itemsPerPage = 6;

    const allItems = [
        ...bankAccounts.map(acc => ({ ...acc, type: 'ACCOUNT' as const })),
        ...creditCards.map(card => ({ ...card, type: 'CARD' as const }))
    ];

    const enrichedItems = allItems.map((item: any) => {
        if (item.type === 'ACCOUNT') {
            const income = transactions
                .filter(t => t.accountId === item.id && t.type === 'income' && t.status === 'completed')
                .reduce((sum: number, t: any) => sum + t.amount, 0);
            const expense = transactions
                .filter(t => t.accountId === item.id && t.type === 'expense' && t.status === 'completed')
                .reduce((sum: number, t: any) => sum + t.amount, 0);
            return { ...item, balance: (item.balance || 0) + income - expense };
        } else {
            const cardExpenses = transactions
                .filter(t => t.cardId === item.id && t.type === 'expense')
                .reduce((sum: number, t: any) => sum + t.amount, 0);
            return { ...item, currentInvoice: (item.currentInvoice || 0) + cardExpenses };
        }
    });

    const totalPages = Math.ceil(enrichedItems.length / itemsPerPage);
    const currentItems = enrichedItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const nextPage = () => setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));

    const handleCardClick = (card: CreditCard) => {
        setSelectedCard(card);
        setIsDetailsModalOpen(true);
    };

    const handleAccountClick = (account: BankAccount) => {
        setSelectedAccount(account);
        setIsEditAccountOpen(true);
    };

    return (
        <>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-[32px] p-6 flex flex-col shadow-sm min-h-[460px] transition-colors duration-300">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 transition-colors">
                            <CardIcon size={22} className="text-neutral-1100 dark:text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-1100 dark:text-white tracking-tight">Cartões e Dinheiro</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-1100 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:scale-110 transition-all shadow-sm"
                            title="Adicionar conta ou cartão"
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

                <div className="flex-1 space-y-4">
                    {currentItems.map((item) => (
                        item.type === 'CARD'
                            ? <CreditCardItem key={item.id} card={item as any} onClick={() => handleCardClick(item as any)} />
                            : <AccountItem key={item.id} account={item} isCash={item.name.toLowerCase() === 'dinheiro'} onClick={() => handleAccountClick(item as any)} />
                    ))}
                    {enrichedItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-neutral-200 rounded-3xl min-h-[200px]">
                            <p className="text-sm text-neutral-400 font-medium">Nenhum item encontrado</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-center lg:hidden">
                    <div className="flex gap-1.5">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all",
                                    i === currentPage ? "w-4 bg-[#D7FF00]" : "bg-neutral-300"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <CardDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                card={selectedCard}
            />

            <AddAccountModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <EditAccountModal
                isOpen={isEditAccountOpen}
                onClose={() => setIsEditAccountOpen(false)}
                account={selectedAccount}
            />
        </>
    );
}
