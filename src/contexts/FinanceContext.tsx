import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    Transaction, Goal, CreditCard, BankAccount, FamilyMember,
    TransactionType, Category
} from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { isWithinInterval, parseISO, startOfMonth, endOfMonth, format } from 'date-fns';
import { useLanguage } from './LanguageContext';

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
    categories: Category[];
    recurringTransactions: any[];
    isLoading: boolean;

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
    addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
    updateTransaction: (id: string, t: Partial<Transaction>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;

    // CRUD Goals
    addGoal: (g: Omit<Goal, 'id'>) => Promise<void>;
    updateGoal: (id: string, g: Partial<Goal>) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;

    // CRUD Cards
    addCard: (c: Omit<CreditCard, 'id'> & { holderId?: string }) => Promise<void>;
    updateCard: (id: string, c: Partial<CreditCard>) => Promise<void>;
    deleteCard: (id: string) => Promise<void>;

    // CRUD Accounts
    addAccount: (a: Omit<BankAccount, 'id'> & { holderId?: string, imageUrl?: string }) => Promise<void>;
    updateAccount: (id: string, a: Partial<BankAccount>) => Promise<void>;
    deleteAccount: (id: string) => Promise<void>;

    // CRUD Members
    addMember: (m: Omit<FamilyMember, 'id'>) => Promise<void>;
    updateMember: (id: string, m: Partial<FamilyMember>) => Promise<void>;
    deleteMember: (id: string) => Promise<void>;

    // CRUD Categories
    addCategory: (c: Omit<Category, 'id'>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;

    // Calculations
    filteredTransactions: Transaction[];
    getFilteredTransactions: () => Transaction[];
    totalBalance: number;
    incomeForPeriod: number;
    expensesForPeriod: number;
    expensesByCategory: Array<{ category: string; value: number }>;
    getCategoryPercentage: (category: string) => number;
    savingsRate: number;
    refreshData: () => Promise<void>;
    deleteMemberTransactions: (memberId: string) => Promise<void>;
    resetAllData: () => Promise<void>;
    processRecurringTransactions: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Explicitly bypass type checking for the supabase client to avoid 'never' issues
const sb = supabase as any;

export function FinanceProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [recurringTransactions, setRecurringTransactions] = useState<any[]>([]);
    const hasProcessedRecurrences = useRef(false);

    const [filters, setFilters] = useState<FinanceContextType['filters']>({
        selectedMember: null,
        dateRange: {
            startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
            endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
        },
        transactionType: 'all',
        searchText: '',
    });

    // Mappers
    const mapTransactionFromDB = (t: any): Transaction => ({
        id: t.id,
        description: t.description,
        amount: Number(t.amount),
        type: (t.type || 'EXPENSE').toLowerCase() as TransactionType,
        category: t.categories?.name || t.category || 'Outros',
        date: t.date,
        status: (t.status || 'COMPLETED').toLowerCase() as any,
        accountId: t.account_id,
        cardId: t.card_id,
        memberId: t.member_id,
        parentTransactionId: t.parent_transaction_id,
        isRecurring: t.is_recurring || false,
        recurringId: t.recurring_id,
        installments: t.total_installments > 1 ? {
            current: t.installment_number || 1,
            total: t.total_installments
        } : undefined
    });

    const mapMemberFromDB = (m: any): FamilyMember => ({
        id: m.id,
        name: m.name,
        role: m.role || 'Membro',
        avatarUrl: m.avatar_url || '',
        income: Number(m.monthly_income || 0)
    });

    // Load Data
    const refreshData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Ensure public.users entry exists (Safety check) - MUST finish before loading other data
            const { data: publicUser, error: checkError } = await sb.from('users').select('id').eq('id', user.id).maybeSingle();

            if (!publicUser && !checkError) {
                console.log('Synchronizing user profile...');
                const { error: insertError } = await sb.from('users').insert({
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.display_name || user.user_metadata?.name || 'Usuário'
                });
                if (insertError) {
                    console.warn('Initial user profile sync error (non-fatal):', insertError.message);
                }
            }

            const results = await Promise.all([
                sb.from('transactions').select('*, categories(name)').order('date', { ascending: false }),
                sb.from('family_members').select('*'),
                sb.from('accounts').select('*'),
                sb.from('goals').select('*'),
                sb.from('categories').select('*').eq('is_active', true),
                sb.from('recurring_transactions').select('*').eq('is_active', true)
            ]);

            const [
                { data: transData, error: transError },
                { data: membersData, error: membersError },
                { data: accountsData, error: accountsError },
                { data: goalsData, error: goalsError },
                { data: categoriesData, error: categoriesError },
                { data: recurringData, error: recurringError }
            ] = results;

            if (transError) console.error('Error loading transactions:', transError);
            if (membersError) console.error('Error loading members:', membersError);
            if (accountsError) console.error('Error loading accounts:', accountsError);
            if (goalsError) console.error('Error loading goals:', goalsError);
            if (categoriesError) console.error('Error loading categories:', categoriesError);
            if (recurringError) console.error('Error loading recurring:', recurringError);

            if (goalsData) {
                setGoals((goalsData as any[]).map((g: any) => ({
                    id: g.id,
                    name: g.name,
                    targetAmount: Number(g.target_amount),
                    currentAmount: Number(g.current_amount),
                    deadline: g.deadline,
                    category: g.category,
                    imageUrl: g.image_url
                })));
            }

            if (categoriesData) {
                setCategories((categoriesData as any[]).map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    type: (c.type || 'EXPENSE').toLowerCase() as TransactionType,
                    icon: c.icon,
                    color: c.color
                })));
            }

            if (transData) setTransactions((transData as any[]).map(mapTransactionFromDB));
            if (membersData) setFamilyMembers((membersData as any[]).map(mapMemberFromDB));
            if (recurringData) setRecurringTransactions(recurringData as any[]);

            // DISABLED automatic recurrence engine on startup as per user request
            // "só aparece quando eu dou o comando para aparecer"
            /*
            if (user && !hasProcessedRecurrences.current) {
                await processRecurringTransactions(user.id);
                hasProcessedRecurrences.current = true;
            }
            */

            if (accountsData) {
                const data = accountsData as any[];
                const banks = data.filter((a: any) => a.type !== 'CREDIT_CARD');
                const cards = data.filter((a: any) => a.type === 'CREDIT_CARD');

                setBankAccounts(banks.map((a: any) => ({
                    id: a.id,
                    name: a.name,
                    balance: Number(a.balance),
                    bankName: a.bank,
                    color: a.color,
                    imageUrl: a.logo_url
                })));

                setCreditCards(cards.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    last4Digits: c.last_digits || '',
                    limit: Number(c.credit_limit || 0),
                    currentInvoice: Number(c.current_bill || 0),
                    closingDay: c.closing_day || 1,
                    dueDay: c.due_day || 10,
                    theme: c.theme || 'black',
                    brand: c.bank,
                    imageUrl: c.logo_url
                })));
            }

        } catch (error) {
            console.error('Unexpected error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) refreshData();
    }, [user, refreshData]);

    // --- CRUD ACTIONS ---

    const addTransaction = async (t: Omit<Transaction, 'id'>) => {
        if (!user) return;

        let catId = null;
        if (t.category) {
            const { data: cat } = await sb.from('categories').select('id').eq('name', t.category).eq('user_id', user.id).single();
            if (cat) catId = (cat as any).id;
            else {
                const { data: newCat } = await sb.from('categories').insert({
                    user_id: user.id,
                    name: t.category,
                    type: t.type.toUpperCase()
                }).select().single();
                if (newCat) catId = (newCat as any).id;
            }
        }

        let finalAccountId = t.accountId;
        if (t.accountId === 'CASH') {
            const { data: cashAcc } = await sb.from('accounts').select('id').eq('name', 'Dinheiro').eq('user_id', user.id).maybeSingle();
            if (cashAcc) {
                finalAccountId = (cashAcc as any).id;
            } else {
                const { data: newCash } = await sb.from('accounts').insert({
                    user_id: user.id,
                    name: 'Dinheiro',
                    type: 'CHECKING',
                    bank: 'Dinheiro',
                    balance: 0,
                    color: '#4ADE80'
                }).select().maybeSingle();
                if (newCash) finalAccountId = (newCash as any).id;
            }
        }

        let recurringId = null;
        if (t.isRecurring) {
            const { data: rt } = await sb.from('recurring_transactions').insert({
                user_id: user.id,
                type: t.type.toUpperCase(),
                amount: t.amount,
                description: t.description,
                category_id: catId,
                account_id: finalAccountId || null,
                member_id: t.memberId || null,
                frequency: 'MONTHLY',
                day_of_month: !isNaN(parseISO(t.date).getTime()) ? parseISO(t.date).getDate() : 1,
                start_date: t.date || new Date().toISOString().split('T')[0],
                is_active: true
            }).select().maybeSingle();
            if (rt) recurringId = (rt as any).id;
        }

        const payload = {
            user_id: user.id,
            description: t.description,
            amount: t.amount,
            type: t.type.toUpperCase(),
            date: t.date || new Date().toISOString().split('T')[0],
            status: t.status.toUpperCase(),
            category_id: catId,
            account_id: finalAccountId || null,
            card_id: t.cardId || null,
            member_id: t.memberId || null,
            is_recurring: t.isRecurring || false,
            recurring_transaction_id: recurringId,
            total_installments: t.installments?.total || 1,
            installment_number: t.installments?.current || 1
        };

        const { data: mainTrans, error } = await sb.from('transactions').insert(payload).select().single();

        if (error) {
            console.error('Error adding transaction:', error);
            alert(`Erro ao salvar transação: ${error.message}`);
            return;
        }

        // Manual balance sync for credit cards (in case trigger is missing)
        if (t.cardId && t.type === 'expense') {
            await sb.rpc('increment_current_bill', { card_id: t.cardId, amount_to_add: t.amount });
            // Fallback if RPC doesn't exist
            const { data: card } = await sb.from('accounts').select('current_bill').eq('id', t.cardId).single();
            if (card) {
                await sb.from('accounts').update({ current_bill: Number(card.current_bill) + t.amount }).eq('id', t.cardId);
            }
        }

        // Handle installments
        if (t.installments && t.installments.total > 1 && t.installments.current === 1) {
            const installments = [];
            const baseDate = parseISO(t.date);

            for (let i = 2; i <= t.installments.total; i++) {
                const installmentDate = new Date(baseDate);
                installmentDate.setMonth(baseDate.getMonth() + (i - 1));

                installments.push({
                    ...payload,
                    date: installmentDate.toISOString().split('T')[0],
                    installment_number: i,
                    parent_transaction_id: (mainTrans as any).id,
                    status: 'PENDING'
                });
            }

            const { error: instError } = await sb.from('transactions').insert(installments);
            if (instError) console.error('Error adding installments:', instError);

            // Update card balance for all future installments too if it's a credit card
            if (t.cardId && t.type === 'expense') {
                const extraAmount = t.amount * (t.installments.total - 1);
                const { data: card } = await sb.from('accounts').select('current_bill').eq('id', t.cardId).single();
                if (card) {
                    await sb.from('accounts').update({ current_bill: Number(card.current_bill) + extraAmount }).eq('id', t.cardId);
                }
            }
        }

        await refreshData();
    };

    const updateTransaction = async (id: string, t: Partial<Transaction>) => {
        const trans = transactions.find(item => item.id === id);
        const payload: any = {};
        if (t.description !== undefined) payload.description = t.description;
        if (t.amount !== undefined) payload.amount = t.amount;
        if (t.status !== undefined) payload.status = t.status.toUpperCase();

        const { error } = await sb.from('transactions').update(payload).eq('id', id);
        if (error) {
            console.error('Error updating transaction:', error);
            alert(`Erro ao atualizar transação: ${error.message}`);
        } else if (trans && trans.cardId && trans.type === 'expense' && t.amount !== undefined) {
            // Amount changed, sync balance
            const diff = t.amount - trans.amount;
            const { data: card } = await sb.from('accounts').select('current_bill').eq('id', trans.cardId).single();
            if (card) {
                await sb.from('accounts').update({ current_bill: Number(card.current_bill) + diff }).eq('id', trans.cardId);
            }
        }
        await refreshData();
    };

    const deleteTransaction = async (id: string) => {
        try {
            const trans = transactions.find(t => t.id === id);
            if (!trans) return;

            // Manual balance sync fallback for credit cards
            if (trans.cardId && trans.type === 'expense') {
                let totalAmountToDelete = trans.amount;

                // If deleting a series, calculate total impact
                if (!trans.parentTransactionId) {
                    const children = transactions.filter(t => t.parentTransactionId === id);
                    totalAmountToDelete += children.reduce((acc, c) => acc + c.amount, 0);
                } else {
                    // It's a child, but the user requested deletion of this child specifically?
                    // Usually we delete the whole series if parentId is present.
                }

                const { data: card } = await sb.from('accounts').select('current_bill').eq('id', trans.cardId).single();
                if (card) {
                    const newBill = Math.max(0, Number(card.current_bill) - totalAmountToDelete);
                    await sb.from('accounts').update({ current_bill: newBill }).eq('id', trans.cardId);
                }
            }

            // Cancel future recurring transactions if applicable
            if (trans.isRecurring && trans.recurringId) {
                if (confirm(t('transactions.recurrenceCancel'))) {
                    await sb.from('recurring_transactions').update({ is_active: false }).eq('id', trans.recurringId);
                }
            }

            // If it belongs to an installment group, ensure the entire series is deleted
            if (trans.parentTransactionId) {
                // Delete children and the parent
                await sb.from('transactions').delete().or(`parent_transaction_id.eq.${trans.parentTransactionId},id.eq.${trans.parentTransactionId}`);
            } else {
                // It might be the parent itself
                await sb.from('transactions').delete().or(`parent_transaction_id.eq.${id},id.eq.${id}`);
            }

            await refreshData();
        } catch (err: any) {
            console.error('Error deleting transaction:', err);
            alert(`${t('Erro ao excluir')}: ${err.message}`);
        }
    };

    const addGoal = async (g: Omit<Goal, 'id'>) => {
        if (!user) return;
        const { error } = await sb.from('goals').insert({
            user_id: user.id,
            name: g.name,
            target_amount: g.targetAmount,
            current_amount: g.currentAmount,
            deadline: g.deadline,
            category: g.category
        });
        if (error) {
            console.error('Error adding goal:', error);
            alert(`Erro ao salvar objetivo: ${error.message}`);
        }
        await refreshData();
    };
    const updateGoal = async (id: string, g: Partial<Goal>) => {
        const payload: any = {};
        if (g.name !== undefined) payload.name = g.name;
        if (g.targetAmount !== undefined) payload.target_amount = g.targetAmount;
        if (g.currentAmount !== undefined) payload.current_amount = g.currentAmount;
        if (g.deadline !== undefined) payload.deadline = g.deadline;
        if (g.category !== undefined) payload.category = g.category;
        if (g.imageUrl !== undefined) payload.image_url = g.imageUrl;

        const { error } = await sb.from('goals').update(payload).eq('id', id);
        if (error) {
            console.error('Error updating goal:', error);
            alert(`Erro ao atualizar objetivo: ${error.message}`);
        }
        await refreshData();
    };

    const processRecurringTransactions = async () => {
        if (!user) return;
        const { data: recurring } = await sb.from('recurring_transactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true);

        if (!recurring || recurring.length === 0) return;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 1-12

        let createdAny = false;

        for (const rt of recurring) {
            // Start and end of month for overlap check
            const startOfM = new Date(currentYear, currentMonth - 1, 1);
            const endOfM = new Date(currentYear, currentMonth, 0); // Last day of month

            const startOfMonthStr = format(startOfM, 'yyyy-MM-dd');
            const endOfMonthStr = format(endOfM, 'yyyy-MM-dd');

            const { count } = await sb.from('transactions')
                .select('*', { count: 'exact', head: true })
                .eq('recurring_transaction_id', rt.id)
                .gte('date', startOfMonthStr)
                .lte('date', endOfMonthStr);

            if (count === 0) {
                // Spawn!
                const day = Math.min(rt.day_of_month || 1, endOfM.getDate());
                const spawnDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                const { error } = await sb.from('transactions').insert({
                    user_id: user.id,
                    recurring_transaction_id: rt.id,
                    description: rt.description,
                    amount: rt.amount,
                    type: rt.type,
                    date: spawnDate,
                    category_id: rt.category_id,
                    account_id: rt.account_id,
                    member_id: rt.member_id,
                    status: 'PENDING',
                    is_recurring: true
                });

                if (!error) createdAny = true;
            }
        }

        // If we created anything, we need to RE-FETCH transactions to show them immediately
        if (createdAny) {
            await refreshData();
        }
    };

    const deleteGoal = async (id: string) => {
        const { error } = await sb.from('goals').delete().eq('id', id);
        if (error) {
            console.error('Error deleting goal:', error);
            alert(`Erro ao excluir objetivo: ${error.message}`);
        }
        await refreshData();
    };

    const addCard = async (c: Omit<CreditCard, 'id'> & { holderId?: string }) => {
        if (!user) return;
        const payload = {
            user_id: user.id,
            type: 'CREDIT_CARD',
            name: c.name,
            bank: c.brand,
            credit_limit: c.limit,
            current_bill: c.currentInvoice,
            closing_day: c.closingDay,
            due_day: c.dueDay,
            last_digits: c.last4Digits,
            theme: c.theme,
            logo_url: c.imageUrl || null,
            holder_id: c.holderId || null
        };

        const { error } = await sb.from('accounts').insert(payload);
        if (error) {
            console.error('Error adding card:', error);
            alert(`Erro ao salvar cartão: ${error.message}`);
        }
        await refreshData();
    };

    const updateCard = async (id: string, c: Partial<CreditCard>) => {
        const payload: any = {};
        if (c.name) payload.name = c.name;
        if (c.limit) payload.credit_limit = c.limit;
        if (c.imageUrl !== undefined) payload.logo_url = c.imageUrl;
        if (c.brand) payload.bank = c.brand;
        if (c.last4Digits) payload.last_digits = c.last4Digits;
        if (c.closingDay) payload.closing_day = c.closingDay;
        if (c.dueDay) payload.due_day = c.dueDay;
        if (c.theme) payload.theme = c.theme;

        const { error } = await sb.from('accounts').update(payload).eq('id', id);
        if (error) {
            console.error('Error updating card:', error);
            alert(`Erro ao atualizar cartão: ${error.message}`);
        }
        await refreshData();
    };

    const deleteCard = async (id: string) => {
        const { error } = await sb.from('accounts').delete().eq('id', id);
        if (error) {
            console.error('Error deleting card:', error);
            alert(`Erro ao deletar cartão: ${error.message}`);
        }
        await refreshData();
    };

    const addAccount = async (a: Omit<BankAccount, 'id'> & { holderId?: string }) => {
        if (!user) return;
        const { error } = await sb.from('accounts').insert({
            user_id: user.id,
            type: 'CHECKING',
            name: a.name,
            bank: a.bankName,
            balance: a.balance,
            color: a.color,
            holder_id: a.holderId || null,
            logo_url: a.imageUrl || null
        });
        if (error) {
            console.error('Error adding account:', error);
            alert(`Erro ao salvar conta: ${error.message}`);
        }
        await refreshData();
    };
    const updateAccount = async (id: string, a: Partial<BankAccount>) => {
        const { error } = await sb.from('accounts').update({
            name: a.name,
            bank: a.bankName,
            balance: a.balance,
            logo_url: a.imageUrl
        }).eq('id', id);
        if (!error) await refreshData();
    };
    const deleteAccount = async (id: string) => {
        const { error } = await sb.from('accounts').delete().eq('id', id);
        if (!error) await refreshData();
    };

    const addMember = async (m: Omit<FamilyMember, 'id'>) => {
        if (!user) return;
        const { error } = await sb.from('family_members').insert({
            user_id: user.id,
            name: m.name,
            role: m.role,
            monthly_income: m.income || 0,
            avatar_url: m.avatarUrl
        });
        if (error) {
            console.error("Error adding member:", error);
            alert(`Erro ao salvar membro: ${error.message}`);
        }
        await refreshData();
    };

    const updateMember = async (id: string, m: Partial<FamilyMember>) => {
        const payload: any = {};
        if (m.name !== undefined) payload.name = m.name;
        if (m.role !== undefined) payload.role = m.role;
        if (m.avatarUrl !== undefined) payload.avatar_url = m.avatarUrl;
        if (m.income !== undefined) payload.monthly_income = m.income;

        const { error } = await sb.from('family_members').update(payload).eq('id', id);
        if (error) {
            console.error('Error updating member:', error);
            alert(`Erro ao atualizar membro: ${error.message}`);
        }
        await refreshData();
    };

    const deleteMember = async (id: string) => {
        const { error } = await sb.from('family_members').delete().eq('id', id);
        if (!error) await refreshData();
    };

    const deleteMemberTransactions = async (memberId: string) => {
        const { error } = await sb.from('transactions').delete().eq('member_id', memberId);
        if (error) {
            console.error('Error deleting member transactions:', error);
            alert(`Erro ao deletar transações do membro: ${error.message}`);
        }
        await refreshData();
    };

    const resetAllData = async () => {
        if (!user) return;
        const tables = ['transactions', 'recurring_transactions', 'goals', 'accounts', 'family_members', 'categories'];

        try {
            for (const table of tables) {
                const { error } = await sb.from(table).delete().eq('user_id', user.id);
                if (error) throw error;
            }
            alert('Todos os dados foram resetados com sucesso.');
        } catch (error: any) {
            console.error('Error resetting data:', error);
            alert(`Erro ao resetar dados: ${error.message}`);
        }
        await refreshData();
    };

    const addCategory = async (c: Omit<Category, 'id'>) => {
        if (!user) return;
        const { error } = await sb.from('categories').insert({
            user_id: user.id,
            name: c.name,
            type: c.type.toUpperCase(),
            icon: c.icon,
            color: c.color
        });
        if (error) console.error('Error adding category:', error);
        await refreshData();
    };

    const deleteCategory = async (id: string) => {
        const { error } = await sb.from('categories').update({ is_active: false }).eq('id', id);
        if (!error) await refreshData();
    };

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
        // If we have bank accounts, use their balances
        if (bankAccounts.length > 0) {
            const banksTotal = bankAccounts.reduce((acc, account) => acc + account.balance, 0);
            const cardsTotal = creditCards.reduce((acc, card) => acc + card.currentInvoice, 0);

            // PROJECTED version: Bank - Card + Pending Income - Pending Expenses
            const pendingIncome = transactions
                .filter(t => t.status === 'pending' && t.type === 'income')
                .reduce((acc, t) => acc + t.amount, 0);
            const pendingExpenses = transactions
                .filter(t => t.status === 'pending' && t.type === 'expense')
                .reduce((acc, t) => acc + t.amount, 0);

            return banksTotal - cardsTotal + pendingIncome - pendingExpenses;
        }

        // Fallback: Sum of all transactions (Income - Expenses)
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);

        return income - expenses;
    }, [bankAccounts, creditCards, transactions]);

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
                const cat = curr.category || 'Outros';
                acc[cat] = (acc[cat] || 0) + curr.amount;
                return acc;
            }, {} as Record<string, number>);

        return Object.entries(grouped)
            .map(([category, value]) => ({ category, value }))
            .sort((a, b) => b.value - a.value);
    }, [filteredTransactions]);

    const getCategoryPercentage = (category: string) => {
        if (expensesForPeriod === 0) return 0;
        const catTotal = expensesByCategory.find(c => c.category === category)?.value || 0;
        return (catTotal / expensesForPeriod) * 100;
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
        categories,
        isLoading,
        filters,
        setFilters,
        addTransaction, updateTransaction, deleteTransaction,
        addGoal, updateGoal, deleteGoal,
        addCard, updateCard, deleteCard,
        addAccount, updateAccount, deleteAccount,
        addMember, updateMember, deleteMember,
        addCategory, deleteCategory,
        filteredTransactions,
        getFilteredTransactions: () => filteredTransactions,
        totalBalance,
        incomeForPeriod,
        expensesForPeriod,
        expensesByCategory,
        getCategoryPercentage,
        savingsRate,
        refreshData,
        deleteMemberTransactions,
        resetAllData,
        processRecurringTransactions,
        recurringTransactions
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
