import { FamilyMember, BankAccount, CreditCard, Transaction, Goal } from '@/types';
import { subMonths, subDays, format } from 'date-fns';

export const MOCK_MEMBERS: FamilyMember[] = [
    {
        id: '1',
        name: 'Vinícius Campos',
        role: 'admin',
        avatarUrl: 'https://github.com/viniciussiqueiradecampos.png',
        income: 8500,
    },
    {
        id: '2',
        name: 'Ana Silva',
        role: 'member',
        avatarUrl: 'https://i.pravatar.cc/150?u=ana',
        income: 4200,
    },
    {
        id: '3',
        name: 'Lucas Campos',
        role: 'member',
        avatarUrl: 'https://i.pravatar.cc/150?u=lucas',
        income: 0,
    },
];

export const MOCK_ACCOUNTS: BankAccount[] = [
    {
        id: 'acc-1',
        name: 'Conta Corrente',
        bankName: 'Itaú',
        balance: 4500.50,
        color: '#EC7000',
    },
    {
        id: 'acc-2',
        name: 'Reserva de Emergência',
        bankName: 'Nubank',
        balance: 12000.00,
        color: '#820AD1',
    },
];

export const MOCK_CARDS: CreditCard[] = [
    {
        id: 'card-1',
        name: 'Mastercard Black',
        last4Digits: '4589',
        limit: 15000,
        currentInvoice: 2450.80,
        closingDay: 5,
        dueDay: 12,
        theme: 'black',
        brand: 'Inter',
    },
    {
        id: 'card-2',
        name: 'Visa Infinite',
        last4Digits: '1234',
        limit: 10000,
        currentInvoice: 1200.50,
        closingDay: 15,
        dueDay: 22,
        theme: 'white',
        brand: 'XP',
    },
    {
        id: 'card-3',
        name: 'Nubank Ultravioleta',
        last4Digits: '9876',
        limit: 8000,
        currentInvoice: 500.00,
        closingDay: 25,
        dueDay: 2,
        theme: 'lime',
        brand: 'Nubank',
    },
];

export const MOCK_GOALS: Goal[] = [
    {
        id: 'goal-1',
        name: 'Viagem Japão',
        targetAmount: 25000,
        currentAmount: 8500,
        deadline: '2025-12-15',
        category: 'Viagem',
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=500&auto=format&fit=crop',
    },
    {
        id: 'goal-2',
        name: 'Troca de Carro',
        targetAmount: 80000,
        currentAmount: 15000,
        deadline: '2026-06-20',
        category: 'Veículo',
        imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=500&auto=format&fit=crop',
    },
    {
        id: 'goal-3',
        name: 'Fundo de Estudos',
        targetAmount: 50000,
        currentAmount: 5000,
        deadline: '2030-01-01',
        category: 'Educação',
        imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=500&auto=format&fit=crop',
    },
    {
        id: 'goal-4',
        name: 'Novo Computador',
        targetAmount: 12000,
        currentAmount: 12000,
        deadline: '2024-05-01',
        category: 'Tecnologia',
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=500&auto=format&fit=crop',
    },
];

const categories = {
    income: ['Salário', 'Investimento', 'Freelance', 'Presente', 'Outros'],
    expense: ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Educação', 'Outros']
};

export const MOCK_TRANSACTIONS: Transaction[] = (() => {
    const transactions: Transaction[] = [];
    const today = new Date();

    // Receitas fixas mensais (últimos 3 meses)
    for (let i = 0; i < 3; i++) {
        const month = subMonths(today, i);
        transactions.push({
            id: `t-inc-v-${i}`,
            description: 'Salário Vinícius',
            amount: 8500,
            type: 'income',
            category: 'Salário',
            date: format(month, 'yyyy-MM-10'),
            status: 'completed',
            accountId: 'acc-1',
            memberId: '1',
        });
        transactions.push({
            id: `t-inc-a-${i}`,
            description: 'Salário Ana',
            amount: 4200,
            type: 'income',
            category: 'Salário',
            date: format(month, 'yyyy-MM-05'),
            status: 'completed',
            accountId: 'acc-2',
            memberId: '2',
        });
    }

    // Despesas variadas
    const expenseCount = 25;
    for (let i = 0; i < expenseCount; i++) {
        const randomDays = Math.floor(Math.random() * 90);
        const date = subDays(today, randomDays);
        const category = categories.expense[Math.floor(Math.random() * categories.expense.length)];
        const memberId = MOCK_MEMBERS[Math.floor(Math.random() * MOCK_MEMBERS.length)].id;
        const isCard = Math.random() > 0.4;

        transactions.push({
            id: `t-exp-${i}`,
            description: `${category} - Compra ${i}`,
            amount: Math.floor(Math.random() * 500) + 20,
            type: 'expense',
            category,
            date: format(date, 'yyyy-MM-dd'),
            status: Math.random() > 0.1 ? 'completed' : 'pending',
            memberId,
            cardId: isCard ? MOCK_CARDS[Math.floor(Math.random() * MOCK_CARDS.length)].id : undefined,
            accountId: !isCard ? MOCK_ACCOUNTS[Math.floor(Math.random() * MOCK_ACCOUNTS.length)].id : undefined,
        });
    }

    return transactions.sort((a, b) => b.date.localeCompare(a.date));
})();
