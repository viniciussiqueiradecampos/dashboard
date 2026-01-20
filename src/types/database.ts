export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    name: string
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    name: string
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            family_members: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    role: string
                    avatar_url: string | null
                    monthly_income: number
                    color: string
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    role: string
                    avatar_url?: string | null
                    monthly_income?: number
                    color?: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    role?: string
                    avatar_url?: string | null
                    monthly_income?: number
                    color?: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    icon: string
                    type: 'INCOME' | 'EXPENSE'
                    color: string
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    icon?: string
                    type: 'INCOME' | 'EXPENSE'
                    color?: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    icon?: string
                    type?: 'INCOME' | 'EXPENSE'
                    color?: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            accounts: {
                Row: {
                    id: string
                    user_id: string
                    type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD'
                    name: string
                    bank: string
                    last_digits: string | null
                    holder_id: string
                    balance: number
                    credit_limit: number | null
                    current_bill: number
                    due_day: number | null
                    closing_day: number | null
                    theme: string | null
                    logo_url: string | null
                    color: string
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD'
                    name: string
                    bank: string
                    last_digits?: string | null
                    holder_id: string
                    balance?: number
                    credit_limit?: number | null
                    current_bill?: number
                    due_day?: number | null
                    closing_day?: number | null
                    theme?: string | null
                    logo_url?: string | null
                    color?: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD'
                    name?: string
                    bank?: string
                    last_digits?: string | null
                    holder_id?: string
                    balance?: number
                    credit_limit?: number | null
                    current_bill?: number
                    due_day?: number | null
                    closing_day?: number | null
                    theme?: string | null
                    logo_url?: string | null
                    color?: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            transactions: {
                Row: {
                    id: string
                    user_id: string
                    type: 'INCOME' | 'EXPENSE'
                    amount: number
                    description: string
                    date: string
                    category_id: string | null
                    account_id: string | null
                    member_id: string | null
                    installment_number: number | null
                    total_installments: number
                    parent_transaction_id: string | null
                    is_recurring: boolean
                    recurring_transaction_id: string | null
                    status: 'PENDING' | 'COMPLETED'
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: 'INCOME' | 'EXPENSE'
                    amount: number
                    description: string
                    date: string
                    category_id?: string | null
                    account_id?: string | null
                    member_id?: string | null
                    installment_number?: number | null
                    total_installments?: number
                    parent_transaction_id?: string | null
                    is_recurring?: boolean
                    recurring_transaction_id?: string | null
                    status?: 'PENDING' | 'COMPLETED'
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'INCOME' | 'EXPENSE'
                    amount?: number
                    description?: string
                    date?: string
                    category_id?: string | null
                    account_id?: string | null
                    member_id?: string | null
                    installment_number?: number | null
                    total_installments?: number
                    parent_transaction_id?: string | null
                    is_recurring?: boolean
                    recurring_transaction_id?: string | null
                    status?: 'PENDING' | 'COMPLETED'
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            recurring_transactions: {
                Row: {
                    id: string
                    user_id: string
                    type: 'INCOME' | 'EXPENSE'
                    amount: number
                    description: string
                    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
                    day_of_month: number | null
                    day_of_week: number | null
                    start_date: string
                    end_date: string | null
                    category_id: string | null
                    account_id: string | null
                    member_id: string | null
                    is_active: boolean
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type?: 'INCOME' | 'EXPENSE'
                    amount: number
                    description: string
                    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
                    day_of_month?: number | null
                    day_of_week?: number | null
                    start_date: string
                    end_date?: string | null
                    category_id?: string | null
                    account_id?: string | null
                    member_id?: string | null
                    is_active?: boolean
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'INCOME' | 'EXPENSE'
                    amount?: number
                    description?: string
                    frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
                    day_of_month?: number | null
                    day_of_week?: number | null
                    start_date?: string
                    end_date?: string | null
                    category_id?: string | null
                    account_id?: string | null
                    member_id?: string | null
                    is_active?: boolean
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            goals: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    target_amount: number
                    current_amount: number
                    deadline: string
                    category: string
                    image_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    target_amount: number
                    current_amount?: number
                    deadline: string
                    category: string
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    target_amount?: number
                    current_amount?: number
                    deadline?: string
                    category?: string
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
