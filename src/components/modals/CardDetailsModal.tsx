import { X, CreditCard as CardIcon } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';
import { useSettings } from '@/contexts/SettingsContext';
import { CreditCard, Transaction } from '@/types';
import { useState, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { EditCardModal } from './EditCardModal';
import { NewTransactionModal } from './NewTransactionModal';

interface CardDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: CreditCard | null;
}

export function CardDetailsModal({ isOpen, onClose, card }: CardDetailsModalProps) {
    const { getFilteredTransactions } = useFinance();
    const { formatCurrency } = useSettings();
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
    const ITEMS_PER_PAGE = 10;

    const cardTransactions = useMemo(() => {
        if (!card) return [];
        return getFilteredTransactions()
            .filter(t => t.type === 'expense' && t.cardId === card.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [card, getFilteredTransactions]);

    const totalPages = Math.ceil(cardTransactions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentTransactions = cardTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (!isOpen || !card) return null;

    const availableLimit = card.limit - card.currentInvoice;
    const usagePercentage = (card.currentInvoice / card.limit) * 100;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-neutral-950 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col border border-transparent dark:border-neutral-800 transition-colors duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden",
                            card.theme === 'black' ? 'bg-neutral-1100 dark:bg-neutral-800' : card.theme === 'lime' ? 'bg-[#D7FF00]' : 'bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700'
                        )}>
                            {card.imageUrl ? (
                                <img src={card.imageUrl} alt={card.brand} className="w-full h-full object-cover" />
                            ) : (
                                <CardIcon size={24} className={card.theme === 'black' ? 'text-white' : 'text-neutral-1100 dark:text-white'} />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-1100 dark:text-white transition-colors">{card.brand} {card.name}</h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 Transition-colors">•••• {card.last4Digits}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors dark:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-neutral-950">
                    {/* Card Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border border-transparent dark:border-neutral-800 transition-colors">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1">Limite Total</p>
                            <p className="text-lg font-bold text-neutral-1100 dark:text-white transition-colors">{formatCurrency(card.limit)}</p>
                        </div>

                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border border-transparent dark:border-neutral-800 transition-colors">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1">Fatura Atual</p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400 transition-colors">{formatCurrency(card.currentInvoice)}</p>
                        </div>

                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border border-transparent dark:border-neutral-800 transition-colors">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1">Disponível</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400 transition-colors">{formatCurrency(availableLimit)}</p>
                        </div>

                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border border-transparent dark:border-neutral-800 transition-colors">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1">Uso do Limite</p>
                            <p className="text-lg font-bold text-neutral-1100 dark:text-white transition-colors">{usagePercentage.toFixed(1)}%</p>
                        </div>

                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border border-transparent dark:border-neutral-800 transition-colors">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1">Fechamento</p>
                            <p className="text-lg font-bold text-neutral-1100 dark:text-white transition-colors">Dia {card.closingDay}</p>
                        </div>

                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 border border-transparent dark:border-neutral-800 transition-colors">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-1">Vencimento</p>
                            <p className="text-lg font-bold text-neutral-1100 dark:text-white transition-colors">Dia {card.dueDay}</p>
                        </div>
                    </div>

                    {/* Usage Progress Bar */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors">Limite Utilizado</p>
                            <p className="text-sm font-bold text-neutral-1100 dark:text-white transition-colors">{usagePercentage.toFixed(1)}%</p>
                        </div>
                        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden transition-colors">
                            <div
                                className={cn(
                                    "h-full transition-all duration-500 rounded-full",
                                    usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 50 ? 'bg-yellow-500' : 'bg-[#D7FF00]'
                                )}
                                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Transactions Section */}
                    <div>
                        <h3 className="text-lg font-bold text-neutral-1100 dark:text-white mb-4 transition-colors">Despesas neste Cartão</h3>

                        {currentTransactions.length > 0 ? (
                            <>
                                <div className="space-y-2">
                                    {currentTransactions.map((transaction: Transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-transparent dark:border-neutral-800 transition-all"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-neutral-1100 dark:text-white transition-colors">{transaction.description}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 transition-colors">{formatDate(transaction.date)}</p>
                                                    <span className="inline-block px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs rounded-full transition-colors">
                                                        {transaction.category}
                                                    </span>
                                                    {transaction.installments && transaction.installments.total > 1 && (
                                                        <span className="text-xs text-neutral-500 dark:text-neutral-400 transition-colors">
                                                            {transaction.installments.current}/{transaction.installments.total}x
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-base font-bold text-neutral-1100 dark:text-white ml-4 transition-colors">
                                                {formatCurrency(transaction.amount)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-6">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all font-medium"
                                        >
                                            Anterior
                                        </button>
                                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Página {currentPage} de {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all font-medium"
                                        >
                                            Próxima
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl transition-colors">
                                <p className="text-neutral-400 dark:text-neutral-500 font-medium">Nenhuma despesa registrada neste cartão ainda.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between gap-3 p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shrink-0 transition-colors">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-white dark:hover:bg-neutral-800 transition-all"
                    >
                        Fechar
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-6 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-white dark:hover:bg-neutral-800 transition-all"
                        >
                            Editar Cartão
                        </button>
                        <button
                            onClick={() => setIsNewTransactionModalOpen(true)}
                            className="px-6 py-2.5 rounded-full bg-neutral-1100 dark:bg-[#D7FF00] text-white dark:text-[#080B12] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>

            <EditCardModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                card={card}
            />

            <NewTransactionModal
                isOpen={isNewTransactionModalOpen}
                onClose={() => setIsNewTransactionModalOpen(false)}
                defaultCardId={card?.id}
            />
        </div>
    );
}
