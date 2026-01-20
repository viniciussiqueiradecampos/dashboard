import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { Transaction, TransactionType, TransactionStatus } from '@/types';

interface EditTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

const EXPENSE_CATEGORIES = ['Alimentação', 'Transporte', 'Educação', 'Lazer', 'Saúde', 'Moradia', 'Serviços', 'Outros'];
const INCOME_CATEGORIES = ['Salário', 'Freelance', 'Investimentos', 'Presentes', 'Outros'];

export function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
    const { updateTransaction, deleteTransaction, familyMembers, bankAccounts, creditCards } = useFinance();

    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [memberId, setMemberId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [cardId, setCardId] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState<TransactionStatus>('completed');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Load transaction data when modal opens
    useEffect(() => {
        if (isOpen && transaction) {
            setType(transaction.type);
            setAmount(transaction.amount.toString());
            setDescription(transaction.description);
            setCategory(transaction.category);
            setMemberId(transaction.memberId || '');
            setAccountId(transaction.accountId || '');
            setCardId(transaction.cardId || '');
            setDate(transaction.date);
            setStatus(transaction.status);
        }
    }, [isOpen, transaction]);

    const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!amount || parseFloat(amount) <= 0) {
            newErrors.amount = 'Valor deve ser maior que zero';
        }

        if (!description || description.length < 3) {
            newErrors.description = 'Descrição deve ter pelo menos 3 caracteres';
        }

        if (!category) {
            newErrors.category = 'Selecione uma categoria';
        }

        if (!memberId) {
            newErrors.memberId = 'Selecione um membro';
        }

        if (!date) {
            newErrors.date = 'Selecione uma data';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate() || !transaction) return;

        updateTransaction(transaction.id, {
            type,
            amount: parseFloat(amount),
            description,
            category,
            memberId,
            accountId: accountId || undefined,
            cardId: cardId || undefined,
            date,
            status,
        });

        onClose();
    };

    const handleDelete = () => {
        if (!transaction) return;
        deleteTransaction(transaction.id);
        setShowDeleteConfirm(false);
        onClose();
    };

    if (!isOpen || !transaction) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 shrink-0">
                    <h2 className="text-xl font-bold text-neutral-1100">Editar Transação</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Type Toggle */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setType('expense')}
                            className={cn(
                                "h-12 rounded-xl font-medium transition-all",
                                type === 'expense'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-white border border-neutral-300 text-neutral-600'
                            )}
                        >
                            Despesa
                        </button>
                        <button
                            onClick={() => setType('income')}
                            className={cn(
                                "h-12 rounded-xl font-medium transition-all",
                                type === 'income'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white border border-neutral-300 text-neutral-600'
                            )}
                        >
                            Receita
                        </button>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Valor</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">R$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={cn(
                                    "w-full h-12 pl-12 pr-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                    errors.amount ? 'border-red-500' : 'border-neutral-300'
                                )}
                                placeholder="0,00"
                            />
                        </div>
                        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Descrição</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                errors.description ? 'border-red-500' : 'border-neutral-300'
                            )}
                            placeholder="Ex: Supermercado, Salário..."
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
                                "w-full h-12 px-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                errors.category ? 'border-red-500' : 'border-neutral-300'
                            )}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>

                    {/* Member */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Membro</label>
                        <select
                            value={memberId}
                            onChange={(e) => setMemberId(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                errors.memberId ? 'border-red-500' : 'border-neutral-300'
                            )}
                        >
                            <option value="">Selecione um membro</option>
                            {familyMembers.map(member => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                        </select>
                        {errors.memberId && <p className="text-red-500 text-xs mt-1">{errors.memberId}</p>}
                    </div>

                    {/* Account / Card */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Conta (Opcional)</label>
                            <select
                                value={accountId}
                                onChange={(e) => { setAccountId(e.target.value); setCardId(''); }}
                                className="w-full h-12 px-4 bg-white border border-neutral-300 rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                            >
                                <option value="">Nenhuma</option>
                                {bankAccounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Cartão (Opcional)</label>
                            <select
                                value={cardId}
                                onChange={(e) => { setCardId(e.target.value); setAccountId(''); }}
                                className="w-full h-12 px-4 bg-white border border-neutral-300 rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                            >
                                <option value="">Nenhum</option>
                                {creditCards.map(card => (
                                    <option key={card.id} value={card.id}>{card.brand} {card.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Data</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                errors.date ? 'border-red-500' : 'border-neutral-300'
                            )}
                        />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setStatus('completed')}
                                className={cn(
                                    "h-12 rounded-xl font-medium transition-all",
                                    status === 'completed'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-white border border-neutral-300 text-neutral-600'
                                )}
                            >
                                Pago
                            </button>
                            <button
                                onClick={() => setStatus('pending')}
                                className={cn(
                                    "h-12 rounded-xl font-medium transition-all",
                                    status === 'pending'
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-white border border-neutral-300 text-neutral-600'
                                )}
                            >
                                Pendente
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 p-6 border-t border-neutral-200 bg-neutral-50 shrink-0">
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-2.5 rounded-full border border-red-300 text-red-600 font-medium hover:bg-red-50 transition-colors"
                    >
                        Excluir
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-full border border-neutral-300 text-neutral-700 font-medium hover:bg-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2.5 rounded-full bg-neutral-1100 text-white font-medium hover:bg-neutral-900 transition-colors"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Overlay */}
                {showDeleteConfirm && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6 rounded-3xl">
                        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
                            <h3 className="text-lg font-bold text-neutral-1100 mb-2">Confirmar Exclusão</h3>
                            <p className="text-neutral-600 mb-6">
                                Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2.5 rounded-full border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-2.5 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
