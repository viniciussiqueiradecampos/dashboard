export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'completed';
export type CreditCardTheme = 'black' | 'white' | 'lime';

export interface FamilyMember {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    income?: number;
}

export interface BankAccount {
    id: string;
    name: string;
    balance: number;
    bankName: string;
    color?: string;
}

export interface CreditCard {
    id: string;
    name: string;
    last4Digits: string;
    limit: number;
    currentInvoice: number;
    closingDay: number;
    dueDay: number;
    theme: CreditCardTheme;
    brand: string;
}

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: TransactionType;
    category: string;
    date: string;
    status: TransactionStatus;
    accountId?: string;
    cardId?: string;
    memberId: string;
    isRecurring?: boolean;
    installments?: {
        current: number;
        total: number;
    };
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    category: string;
    imageUrl?: string;
}

export interface Category {
    id: string;
    name: string;
    type: TransactionType;
    icon?: string;
    color?: string;
}
