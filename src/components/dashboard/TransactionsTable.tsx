import { Search, ArrowUpCircle, ArrowDownCircle, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { Transaction } from '@/types';

const ITEMS_PER_PAGE = 5;

export function TransactionsTable() {
    const { getFilteredTransactions, familyMembers, bankAccounts, creditCards } = useFinance();
    const [localSearch, setLocalSearch] = useState('');
    const [localTypeFilter, setLocalTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Get globally filtered transactions and apply local filters
    const filteredTransactions = useMemo(() => {
        let transactions = getFilteredTransactions();

        // Apply local search filter
        if (localSearch.trim()) {
            const searchLower = localSearch.toLowerCase();
            transactions = transactions.filter(
                (t: Transaction) =>
                    t.description.toLowerCase().includes(searchLower) ||
                    t.category.toLowerCase().includes(searchLower)
            );
        }

        // Apply local type filter
        if (localTypeFilter !== 'all') {
            transactions = transactions.filter((t: Transaction) => t.type === localTypeFilter);
        }

        // Sort by date descending (most recent first)
        return transactions.sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [getFilteredTransactions, localSearch, localTypeFilter]);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [localSearch, localTypeFilter]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const getMemberAvatar = (memberId: string) => {
        const member = familyMembers.find((m) => m.id === memberId);
        return member?.avatarUrl;
    };

    const getAccountName = (transaction: Transaction) => {
        if (transaction.accountId) {
            const account = bankAccounts.find((a) => a.id === transaction.accountId);
            return account?.name || 'Desconhecido';
        }
        if (transaction.cardId) {
            const card = creditCards.find((c) => c.id === transaction.cardId);
            return card ? `${card.brand} ${card.name}` : 'Desconhecido';
        }
        return 'Desconhecido';
    };

    const getInstallmentText = (transaction: Transaction) => {
        if (!transaction.installments || transaction.installments.total === 1) {
            return '-';
        }
        return `${transaction.installments.current}/${transaction.installments.total}`;
    };

    const renderPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // First 3 pages
            pages.push(1, 2, 3);

            if (currentPage > 4 && currentPage < totalPages - 3) {
                pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
            } else if (currentPage <= 4) {
                pages.push('...');
            } else {
                pages.push('...');
            }

            // Last 2 pages
            pages.push(totalPages - 1, totalPages);
        }

        return pages.map((page, index) => {
            if (page === '...') {
                return (
                    <span key={`ellipsis-${index}`} className="px-3 py-1.5 text-neutral-400">
                        ...
                    </span>
                );
            }

            return (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        currentPage === page
                            ? 'bg-neutral-1100 text-white'
                            : 'text-neutral-500 hover:bg-neutral-100'
                    )}
                >
                    {page}
                </button>
            );
        });
    };

    return (
        <div className="bg-white rounded-[20px] border border-neutral-300 p-8 shadow-sm w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <h2 className="text-xl font-bold text-neutral-1100 tracking-tight">
                    Extrato detalhado
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar lançamentos..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-white border border-neutral-200 rounded-full text-sm text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                        />
                    </div>

                    {/* Type Filter */}
                    <select
                        value={localTypeFilter}
                        onChange={(e) => setLocalTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
                        className="w-full sm:w-[140px] h-10 px-4 bg-white border border-neutral-200 rounded-full text-sm text-neutral-900 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none cursor-pointer"
                    >
                        <option value="all">Todos</option>
                        <option value="income">Receitas</option>
                        <option value="expense">Despesas</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto -mx-8 px-8">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-50">
                            <th className="text-left py-4 px-4 text-xs font-bold text-neutral-600 uppercase tracking-wider w-[50px]">
                                Membro
                            </th>
                            <th className="text-left py-4 px-4 text-xs font-bold text-neutral-600 uppercase tracking-wider">
                                Datas
                            </th>
                            <th className="text-left py-4 px-4 text-xs font-bold text-neutral-600 uppercase tracking-wider">
                                Descrição
                            </th>
                            <th className="text-left py-4 px-4 text-xs font-bold text-neutral-600 uppercase tracking-wider">
                                Categorias
                            </th>
                            <th className="text-left py-4 px-4 text-xs font-bold text-neutral-600 uppercase tracking-wider">
                                Conta/cartão
                            </th>
                            <th className="text-left py-4 px-4 text-xs font-bold text-neutral-600 uppercase tracking-wider">
                                Parcelas
                            </th>
                            <th className="text-right py-4 px-4 text-xs font-bold text-neutral-600 uppercase tracking-wider">
                                Valor
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions.length > 0 ? (
                            currentTransactions.map((transaction: Transaction, index: number) => (
                                <tr
                                    key={transaction.id}
                                    className={cn(
                                        'border-b border-neutral-100 last:border-b-0 transition-colors hover:bg-neutral-50',
                                        index % 2 === 1 && 'bg-neutral-25'
                                    )}
                                >
                                    {/* Avatar */}
                                    <td className="py-4 px-4">
                                        {getMemberAvatar(transaction.memberId) ? (
                                            <img
                                                src={getMemberAvatar(transaction.memberId)}
                                                alt="Member"
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center">
                                                <User size={14} className="text-neutral-500" />
                                            </div>
                                        )}
                                    </td>

                                    {/* Date */}
                                    <td className="py-4 px-4 text-sm text-neutral-600">
                                        {formatDate(transaction.date)}
                                    </td>

                                    {/* Description */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={cn(
                                                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                                                    transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                                                )}
                                            >
                                                {transaction.type === 'income' ? (
                                                    <ArrowDownCircle size={16} className="text-green-600" />
                                                ) : (
                                                    <ArrowUpCircle size={16} className="text-red-600" />
                                                )}
                                            </div>
                                            <span className="text-sm font-bold text-neutral-1100 truncate">
                                                {transaction.description}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="py-4 px-4">
                                        <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
                                            {transaction.category}
                                        </span>
                                    </td>

                                    {/* Account/Card */}
                                    <td className="py-4 px-4 text-sm text-neutral-600">
                                        {getAccountName(transaction)}
                                    </td>

                                    {/* Installments */}
                                    <td className="py-4 px-4 text-sm text-neutral-600 text-center">
                                        {getInstallmentText(transaction)}
                                    </td>

                                    {/* Value */}
                                    <td className="py-4 px-4 text-right">
                                        <span
                                            className={cn(
                                                'text-sm font-bold',
                                                transaction.type === 'income' ? 'text-green-600' : 'text-neutral-1100'
                                            )}
                                        >
                                            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-12 text-center">
                                    <p className="text-neutral-400 font-medium">
                                        Nenhum lançamento encontrado.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredTransactions.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-neutral-200">
                    <p className="text-sm text-neutral-600">
                        Mostrando {startIndex + 1} a {Math.min(endIndex, filteredTransactions.length)} de{' '}
                        {filteredTransactions.length}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex items-center gap-1">
                            {renderPageNumbers()}
                        </div>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
