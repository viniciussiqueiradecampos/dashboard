import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { Transaction, TransactionType, TransactionStatus } from '@/types';
import { CategorySelector } from '@/components/ui/CategorySelector';
import { useLanguage } from '@/contexts/LanguageContext';

interface EditTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

export function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
    const { updateTransaction, deleteTransaction, familyMembers, bankAccounts, creditCards, categories, addCategory, deleteCategory } = useFinance();
    const { t } = useLanguage();

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

    const handleCreateCategory = async (name: string) => {
        await addCategory({
            name: name,
            type: type,
            icon: '🏷️',
            color: '#333'
        });
        setCategory(name);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!amount || parseFloat(amount) <= 0) {
            newErrors.amount = 'Valor deve ser maior que zero';
        }

        // Descrição agora é opcional, conforme mudança anterior
        // if (!description || description.length < 3) {
        //     newErrors.description = 'Descrição deve ter pelo menos 3 caracteres';
        // }

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
                className="bg-white dark:bg-neutral-900 w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col border border-neutral-200 dark:border-neutral-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                    <h2 className="text-xl font-bold text-neutral-1100 dark:text-white">{t('common.edit')}</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors text-neutral-500 dark:text-neutral-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Type Toggle */}
                    <div className="p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl grid grid-cols-2 gap-1">
                        <button
                            onClick={() => setType('expense')}
                            className={cn(
                                "h-10 rounded-xl font-bold text-sm transition-all",
                                type === 'expense'
                                    ? 'bg-white dark:bg-neutral-700 text-red-600 dark:text-red-400 shadow-sm'
                                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                            )}
                        >
                            {t('Saída')}
                        </button>
                        <button
                            onClick={() => setType('income')}
                            className={cn(
                                "h-10 rounded-xl font-bold text-sm transition-all",
                                type === 'income'
                                    ? 'bg-white dark:bg-neutral-700 text-green-600 dark:text-green-400 shadow-sm'
                                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                            )}
                        >
                            {t('Entrada')}
                        </button>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Valor')}</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">R$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={cn(
                                    "w-full h-14 pl-12 pr-4 bg-white dark:bg-neutral-800 border rounded-2xl text-lg font-bold text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                    errors.amount ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                                )}
                                placeholder="0,00"
                            />
                        </div>
                        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Descrição (Opcional)')}</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={cn(
                                "w-full h-14 px-4 bg-white dark:bg-neutral-800 border rounded-2xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                errors.description ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                            )}
                            placeholder="Ex: Supermercado, Salário..."
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Category */}
                    <CategorySelector
                        categories={categories}
                        selectedCategory={category}
                        onSelect={(name) => setCategory(name)}
                        onAddCategory={handleCreateCategory}
                        onDeleteCategory={(id) => {
                            deleteCategory(id);
                            if (categories.find(c => c.id === id)?.name === category) {
                                setCategory('');
                            }
                        }}
                        type={type}
                        error={errors.category}
                    />

                    {/* Member */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Membro')}</label>
                        <select
                            value={memberId}
                            onChange={(e) => setMemberId(e.target.value)}
                            className={cn(
                                "w-full h-14 px-4 bg-white dark:bg-neutral-800 border rounded-2xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                errors.memberId ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                            )}
                        >
                            <option value="">{t('Selecione um membro')}</option>
                            {familyMembers.map(member => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                        </select>
                        {errors.memberId && <p className="text-red-500 text-xs mt-1">{errors.memberId}</p>}
                    </div>

                    {/* Account / Card */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Conta (Opcional)')}</label>
                            <select
                                value={accountId}
                                onChange={(e) => { setAccountId(e.target.value); setCardId(''); }}
                                className="w-full h-14 px-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none"
                            >
                                <option value="">{t('Nenhuma')}</option>
                                {bankAccounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Cartão (Opcional)')}</label>
                            <select
                                value={cardId}
                                onChange={(e) => { setCardId(e.target.value); setAccountId(''); }}
                                className="w-full h-14 px-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none"
                            >
                                <option value="">{t('Nenhum')}</option>
                                {creditCards.map(card => (
                                    <option key={card.id} value={card.id}>{card.brand} {card.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Datas')}</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={cn(
                                "w-full h-14 px-4 bg-white dark:bg-neutral-800 border rounded-2xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                errors.date ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                            )}
                        />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Status')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setStatus('completed')}
                                className={cn(
                                    "h-12 rounded-xl font-medium transition-all",
                                    status === 'completed'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                                )}
                            >
                                {t('Pago')}
                            </button>
                            <button
                                onClick={() => setStatus('pending')}
                                className={cn(
                                    "h-12 rounded-xl font-medium transition-all",
                                    status === 'pending'
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                                )}
                            >
                                {t('Pendente')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 shrink-0">
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-3 rounded-full border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        {t('common.delete')}
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-3 rounded-full bg-[#080B12] dark:bg-[#D7FF00] text-white dark:text-[#080B12] font-bold hover:opacity-90 transition-opacity"
                        >
                            {t('common.save')}
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Overlay */}
                {showDeleteConfirm && (
                    <div className="absolute inset-0 bg-black/50 z-[60] flex items-center justify-center p-6 rounded-[32px]">
                        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-xl max-w-sm w-full border border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-lg font-bold text-neutral-1100 dark:text-white mb-2">{t('Confirmar Exclusão')}</h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                {t('Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.')}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
                                >
                                    {t('common.delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
