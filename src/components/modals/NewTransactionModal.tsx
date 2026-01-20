import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { TransactionType } from '@/types';

interface NewTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewTransactionModal({ isOpen, onClose }: NewTransactionModalProps) {
    const { addTransaction, familyMembers, bankAccounts, creditCards } = useFinance();

    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [memberId, setMemberId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [installments, setInstallments] = useState(1);
    const [isRecurring, setIsRecurring] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const expenseCategories = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Educação'];
    const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Outros'];

    const categories = type === 'income' ? incomeCategories : expenseCategories;

    const isCard = creditCards.some(c => c.id === accountId);
    const showInstallments = isCard && type === 'expense';

    const validate = () => {
        const newErrors: Record<string, string> = {};

        const numAmount = parseFloat(amount);
        if (!amount || numAmount <= 0) {
            newErrors.amount = 'Valor deve ser maior que zero';
        }

        if (!description || description.length < 3) {
            newErrors.description = 'Descrição deve ter pelo menos 3 caracteres';
        }

        if (!category) {
            newErrors.category = 'Selecione uma categoria';
        }

        if (!accountId) {
            newErrors.accountId = 'Selecione uma conta ou cartão';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        addTransaction({
            description,
            amount: parseFloat(amount),
            type,
            category,
            date,
            status: 'completed',
            accountId,
            memberId,
            installments: showInstallments ? { current: 1, total: installments } : undefined,
        });

        // Reset form
        setAmount('');
        setDescription('');
        setCategory('');
        setAccountId('');
        setInstallments(1);
        setIsRecurring(false);
        setErrors({});

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div
                className="bg-white w-full h-full md:h-auto md:max-w-2xl md:rounded-3xl overflow-hidden flex flex-col md:max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-neutral-200 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center",
                            type === 'income' ? 'bg-[#D7FF00]' : 'bg-[#080B12]'
                        )}>
                            {type === 'income' ? (
                                <ArrowDownCircle size={32} className="text-[#080B12]" />
                            ) : (
                                <ArrowUpCircle size={32} className="text-white" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-1100">Nova Transação</h2>
                            <p className="text-sm text-neutral-500">Registre entradas e saídas para manter seu controle</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-neutral-50 p-8">
                    <div className="max-w-xl mx-auto space-y-6">
                        {/* Type Toggle */}
                        <div className="bg-neutral-200 p-1 rounded-full flex gap-1">
                            <button
                                onClick={() => setType('income')}
                                className={cn(
                                    "flex-1 py-3 rounded-full font-medium transition-all",
                                    type === 'income' ? 'bg-white shadow-sm text-neutral-1100' : 'text-neutral-500'
                                )}
                            >
                                Receita
                            </button>
                            <button
                                onClick={() => setType('expense')}
                                className={cn(
                                    "flex-1 py-3 rounded-full font-medium transition-all",
                                    type === 'expense' ? 'bg-white shadow-sm text-neutral-1100' : 'text-neutral-500'
                                )}
                            >
                                Despesa
                            </button>
                        </div>

                        {/* Amount & Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Valor da Transação
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className={cn(
                                            "w-full h-14 pl-12 pr-4 bg-white border rounded-2xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                            errors.amount ? 'border-red-500' : 'border-neutral-300'
                                        )}
                                        placeholder="0,00"
                                    />
                                </div>
                                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Data</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full h-14 px-4 bg-white border border-neutral-300 rounded-2xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Descrição</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={cn(
                                    "w-full h-14 px-4 bg-white border rounded-2xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                    errors.description ? 'border-red-500' : 'border-neutral-300'
                                )}
                                placeholder="Ex: Supermercado Semanal"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Categoria</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={cn(
                                    "w-full h-14 px-4 bg-white border rounded-2xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                    errors.category ? 'border-red-500' : 'border-neutral-300'
                                )}
                            >
                                <option value="">Selecione a categoria</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>

                        {/* Member & Account */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Membro</label>
                                <select
                                    value={memberId || ''}
                                    onChange={(e) => setMemberId(e.target.value || '')}
                                    className="w-full h-14 px-4 bg-white border border-neutral-300 rounded-2xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                                >
                                    <option value="">Família (Geral)</option>
                                    {familyMembers.map(member => (
                                        <option key={member.id} value={member.id}>{member.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Conta / Cartão</label>
                                <select
                                    value={accountId}
                                    onChange={(e) => setAccountId(e.target.value)}
                                    className={cn(
                                        "w-full h-14 px-4 bg-white border rounded-2xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                        errors.accountId ? 'border-red-500' : 'border-neutral-300'
                                    )}
                                >
                                    <option value="">Selecione</option>
                                    <optgroup label="Contas Bancárias">
                                        {bankAccounts.map(acc => (
                                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Cartões de Crédito">
                                        {creditCards.map(card => (
                                            <option key={card.id} value={card.id}>{card.brand} {card.name}</option>
                                        ))}
                                    </optgroup>
                                </select>
                                {errors.accountId && <p className="text-red-500 text-xs mt-1">{errors.accountId}</p>}
                            </div>
                        </div>

                        {/* Installments (conditional) */}
                        {showInstallments && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Parcelamento</label>
                                <select
                                    value={installments}
                                    onChange={(e) => setInstallments(parseInt(e.target.value))}
                                    disabled={isRecurring}
                                    className="w-full h-14 px-4 bg-white border border-neutral-300 rounded-2xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none disabled:opacity-50"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                                        <option key={n} value={n}>{n}x</option>
                                    ))}
                                </select>
                                {isRecurring && (
                                    <p className="text-xs text-neutral-500 italic mt-1">Parcelamento desabilitado para despesas recorrentes</p>
                                )}
                            </div>
                        )}

                        {/* Recurring (conditional) */}
                        {type === 'expense' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isRecurring}
                                        onChange={(e) => {
                                            setIsRecurring(e.target.checked);
                                            if (e.target.checked) setInstallments(1);
                                        }}
                                        disabled={installments > 1}
                                        className="mt-1"
                                    />
                                    <div>
                                        <p className="font-bold text-neutral-1100">Despesa Recorrente</p>
                                        <p className="text-xs text-neutral-600 mt-1">
                                            {installments > 1
                                                ? 'Não disponível para compras parceladas'
                                                : 'Contas que se repetem todo mês (Netflix, Spotify, Academia, etc.)'}
                                        </p>
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 bg-white shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-full border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 rounded-full bg-neutral-1100 text-white font-medium hover:bg-neutral-900 transition-colors"
                    >
                        Salvar Transação
                    </button>
                </div>
            </div>
        </div>
    );
}
