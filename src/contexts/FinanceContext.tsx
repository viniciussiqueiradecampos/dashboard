import React, { createContext, useContext, useState, useMemo } from 'react';
import {
    Transaction, Goal, CreditCard, BankAccount, FamilyMember,
    TransactionType
} from '@/types';
import {
    MOCK_TRANSACTIONS, MOCK_GOALS, MOCK_CARDS,
    MOCK_ACCOUNTS, MOCK_MEMBERS
} from '@/constants/mockData';
import { isWithinInterval, parseISO, startOfMonth, endOfMonth } from 'date-fns';

interface DateRange {
    startDate: string;
    endDate: string;
}

interface FinanceContextType {
    // Data
    transactions: Transaction[];
    goals: Goal[];
    creditCards: CreditCard[];
    bankAccounts: BankAccount[];
    familyMembers: FamilyMember[];

    // Filters
    filters: {
        selectedMember: string | null;
        dateRange: DateRange;
        transactionType: 'all' | TransactionType;
        searchText: string;
    };

    // Actions
    setFilters: React.Dispatch<React.SetStateAction<FinanceContextType['filters']>>;

    // CRUD Transactions
    addTransaction: (t: Omit<Transaction, 'id'>) => void;
    updateTransaction: (id: string, t: Partial<Transaction>) => void;
    deleteTransaction: (id: string) => void;

    // CRUD Goals
    addGoal: (g: Omit<Goal, 'id'>) => void;
    updateGoal: (id: string, g: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;

    // CRUD Cards
    addCard: (c: Omit<CreditCard, 'id'>) => void;
    updateCard: (id: string, c: Partial<CreditCard>) => void;
    deleteCard: (id: string) => void;

    // CRUD Accounts
    addAccount: (a: Omit<BankAccount, 'id'>) => void;
    updateAccount: (id: string, a: Partial<BankAccount>) => void;
    deleteAccount: (id: string) => void;

    // CRUD Members
    addMember: (m: Omit<FamilyMember, 'id'>) => void;
    updateMember: (id: string, m: Partial<FamilyMember>) => void;
    deleteMember: (id: string) => void;

    // Calculations
    filteredTransactions: Transaction[];
    totalBalance: number;
    incomeForPeriod: number;
    expensesForPeriod: number;
    expensesByCategory: Array<{ category: string; value: number }>;
    getCategoryPercentage: (category: string) => number;
    savingsRate: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
    // Persistent State (In-Memory only per rules)
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
    const [creditCards, setCreditCards] = useState<CreditCard[]>(MOCK_CARDS);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(MOCK_ACCOUNTS);
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(MOCK_MEMBERS);

    // Global Filters
    const [filters, setFilters] = useState<FinanceContextType['filters']>({
        selectedMember: null,
        dateRange: {
            startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
            endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
        },
        transactionType: 'all',
        searchText: '',
    });

    // --- CRUD HELPERS ---
    const addTransaction = (t: Omit<Transaction, 'id'>) => {
        setTransactions(prev => [{ ...t, id: crypto.randomUUID() }, ...prev]);
    };
    const updateTransaction = (id: string, t: Partial<Transaction>) => {
        setTransactions(prev => prev.map(item => item.id === id ? { ...item, ...t } : item));
    };
    const deleteTransaction = (id: string) => {
        setTransactions(prev => prev.filter(item => item.id !== id));
    };

    const addGoal = (g: Omit<Goal, 'id'>) => {
        setGoals(prev => [{ ...g, id: crypto.randomUUID() }, ...prev]);
    };
    const updateGoal = (id: string, g: Partial<Goal>) => {
        setGoals(prev => prev.map(item => item.id === id ? { ...item, ...g } : item));
    };
    const deleteGoal = (id: string) => {
        setGoals(prev => prev.filter(item => item.id !== id));
    };

    const addCard = (c: Omit<CreditCard, 'id'>) => {
        setCreditCards(prev => [{ ...c, id: crypto.randomUUID() }, ...prev]);
    };
    const updateCard = (id: string, c: Partial<CreditCard>) => {
        setCreditCards(prev => prev.map(item => item.id === id ? { ...item, ...c } : item));
    };
    const deleteCard = (id: string) => {
        setCreditCards(prev => prev.filter(item => item.id !== id));
    };

    const addAccount = (a: Omit<BankAccount, 'id'>) => {
        setBankAccounts(prev => [{ ...a, id: crypto.randomUUID() }, ...prev]);
    };
    const updateAccount = (id: string, a: Partial<BankAccount>) => {
        setBankAccounts(prev => prev.map(item => item.id === id ? { ...item, ...a } : item));
    };
    const deleteAccount = (id: string) => {
        setBankAccounts(prev => prev.filter(item => item.id !== id));
    };

    const addMember = (m: Omit<FamilyMember, 'id'>) => {
        setFamilyMembers(prev => [{ ...m, id: crypto.randomUUID() }, ...prev]);
    };
    const updateMember = (id: string, m: Partial<FamilyMember>) => {
        setFamilyMembers(prev => prev.map(item => item.id === id ? { ...item, ...m } : item));
    };
    const deleteMember = (id: string) => {
        setFamilyMembers(prev => prev.filter(item => item.id !== id));
    };

    // --- CALCULATIONS ---

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesMember = !filters.selectedMember || t.memberId === filters.selectedMember;
            const matchesType = filters.transactionType === 'all' || t.type === filters.transactionType;
            const matchesSearch = !filters.searchText ||
                t.description.toLowerCase().includes(filters.searchText.toLowerCase()) ||
                t.category.toLowerCase().includes(filters.searchText.toLowerCase());

            const tDate = parseISO(t.date);
            const matchesDate = isWithinInterval(tDate, {
                start: parseISO(filters.dateRange.startDate),
                end: parseISO(filters.dateRange.endDate),
            });

            return matchesMember && matchesType && matchesSearch && matchesDate;
        });
    }, [transactions, filters]);

    const totalBalance = useMemo(() => {
        const accBalance = bankAccounts.reduce((acc, curr) => acc + curr.balance, 0);
        const cardDebt = creditCards.reduce((acc, curr) => acc + curr.currentInvoice, 0);
        return accBalance - cardDebt;
    }, [bankAccounts, creditCards]);

    const incomeForPeriod = useMemo(() => {
        return filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);
    }, [filteredTransactions]);

    const expensesForPeriod = useMemo(() => {
        return filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);
    }, [filteredTransactions]);

    const expensesByCategory = useMemo(() => {
        const grouped = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => {
                acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
                return acc;
            }, {} as Record<string, number>);

        return Object.entries(grouped)
            .map(([category, value]) => ({ category, value }))
            .sort((a, b) => b.value - a.value);
    }, [filteredTransactions]);

    const getCategoryPercentage = (category: string) => {
        if (incomeForPeriod === 0) return 0;
        const catTotal = expensesByCategory.find(c => c.category === category)?.value || 0;
        return (catTotal / incomeForPeriod) * 100;
    };

    const savingsRate = useMemo(() => {
        if (incomeForPeriod === 0) return 0;
        const savings = incomeForPeriod - expensesForPeriod;
        return (savings / incomeForPeriod) * 100;
    }, [incomeForPeriod, expensesForPeriod]);

    const value = {
        transactions,
        goals,
        creditCards,
        bankAccounts,
        familyMembers,
        filters,
        setFilters,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        addCard,
        updateCard,
        deleteCard,
        addAccount,
        updateAccount,
        deleteAccount,
        addMember,
        updateMember,
        deleteMember,
        filteredTransactions,
        totalBalance,
        incomeForPeriod,
        expensesForPeriod,
        expensesByCategory,
        getCategoryPercentage,
        savingsRate,
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
}

export function useFinance() {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
}

// Utility to re-import format since I used it inside Provider for initial state
import { format } from 'date-fns';
