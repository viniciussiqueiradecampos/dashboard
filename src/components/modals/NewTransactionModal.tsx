import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { TransactionType } from '@/types';
import { CategorySelector } from '@/components/ui/CategorySelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';

interface NewTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultCardId?: string;
}

export function NewTransactionModal({ isOpen, onClose, defaultCardId }: NewTransactionModalProps) {
    const { t } = useLanguage();
    const { currency } = useSettings();
    const {
        addTransaction,
        familyMembers,
        bankAccounts,
        creditCards,
        categories,
        addCategory,
        deleteCategory,
        addAccount
    } = useFinance();

    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'completed' | 'pending'>('completed');

    // Category Management
    const [categoryInput, setCategoryInput] = useState('');

    const [memberId, setMemberId] = useState('');
    const [accountId, setAccountId] = useState(defaultCardId || '');
    const [installments, setInstallments] = useState(1);
    const [isRecurring, setIsRecurring] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // New Account Management
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Update accountId when modal opens with defaultCardId
    // Update accountId when modal opens with defaultCardId
    useEffect(() => {
        if (isOpen && defaultCardId) {
            setAccountId(defaultCardId);
        }
    }, [isOpen, defaultCardId]);

    // Update status based on date
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            setStatus('pending');
        } else {
            setStatus('completed');
        }
    }, [date]);

    const isCard = creditCards.some(c => c.id === accountId);
    const isAccount = bankAccounts.some(a => a.id === accountId);
    const showInstallments = isCard && type === 'expense';

    const handleCreateAccount = async () => {
        if (!newAccountName.trim()) return;
        await addAccount({
            name: newAccountName,
            bankName: 'Outros', // Default bank name
            balance: 0,
            color: '#000000'
        });
        setNewAccountName('');
        setIsCreatingAccount(false);
    };

    const handleCreateCategory = async (name: string) => {
        await addCategory({
            name: name,
            type: type,
            icon: '🏷️',
            color: '#333'
        });
        setCategoryInput(name);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        const numAmount = parseFloat(amount);
        if (!amount || numAmount <= 0) {
            newErrors.amount = t('Valor deve ser maior que zero');
        }

        if (!description.trim()) {
            newErrors.description = t('Descrição é obrigatória');
        }

        if (!date) {
            newErrors.date = t('Data é obrigatória');
        }

        if (!categoryInput) {
            newErrors.category = t('Selecione uma categoria');
        }

        if (!accountId && !isCreatingAccount) {
            newErrors.accountId = t('Selecione uma conta, cartão ou método');
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
            category: categoryInput,
            date,
            status: status,
            accountId: isAccount ? accountId : undefined,
            cardId: isCard ? accountId : undefined,
            memberId,
            isRecurring,
            installments: showInstallments ? { current: 1, total: installments } : undefined,
        });

        // Reset form
        setAmount('');
        setDescription('');
        setCategoryInput('');
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
                <div className="flex items-center justify-between p-8 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-14 h-14 rounded-[20px] flex items-center justify-center",
                            type === 'income' ? 'bg-[#D7FF00]' : 'bg-[#080B12] dark:bg-white'
                        )}>
                            {type === 'income' ? (
                                <ArrowDownCircle size={32} className="text-[#080B12]" />
                            ) : (
                                <ArrowUpCircle size={32} className="text-white dark:text-[#080B12]" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-1100 dark:text-white">{t('Transações Recorrentes')}</h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('Registre despesas e receitas fixas')}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors dark:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-900 p-8">
                    <div className="max-w-xl mx-auto space-y-6">
                        {/* Type Toggle */}
                        <div className="bg-neutral-200 dark:bg-neutral-800 p-1 rounded-full flex gap-1">
                            <button
                                onClick={() => { setType('income'); setCategoryInput(''); }}
                                className={cn(
                                    "flex-1 py-3 rounded-full font-medium transition-all",
                                    type === 'income' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-1100 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
                                )}
                            >
                                {t('Receita')}
                            </button>
                            <button
                                onClick={() => { setType('expense'); setCategoryInput(''); }}
                                className={cn(
                                    "flex-1 py-3 rounded-full font-medium transition-all",
                                    type === 'expense' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-1100 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
                                )}
                            >
                                {t('Despesa')}
                            </button>
                        </div>

                        {/* Amount & Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                    {t('Valor')}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">{currency === 'BRL' ? 'R$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className={cn(
                                            "w-full h-14 pl-12 pr-4 bg-white dark:bg-neutral-800 border rounded-2xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                            errors.amount ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                                        )}
                                        placeholder="0,00"
                                    />
                                </div>
                                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Data')}</label>
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
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Descrição')}</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={cn(
                                    "w-full h-14 px-4 bg-white dark:bg-neutral-800 border rounded-2xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                    errors.description ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                                )}
                                placeholder={t('Ex: Mercado')}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        {/* Status Checkbox */}
                        <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 p-4 rounded-2xl">
                            <input
                                type="checkbox"
                                id="status-check"
                                checked={status === 'completed'}
                                onChange={(e) => setStatus(e.target.checked ? 'completed' : 'pending')}
                                className="w-5 h-5 rounded border-neutral-300 text-black focus:ring-black"
                            />
                            <label htmlFor="status-check" className="font-medium text-neutral-1100 dark:text-white cursor-pointer select-none">
                                {type === 'income' ? t('Recebido') : t('Pago')}
                            </label>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-auto">
                                {status === 'completed'
                                    ? (type === 'income' ? t('Valor já entrou na conta') : t('Valor já saiu da conta'))
                                    : (type === 'income' ? t('Aguardando recebimento') : t('Agendado / Pendente'))}
                            </span>
                        </div>

                        {/* Category with Add/Remove */}
                        <CategorySelector
                            categories={categories}
                            selectedCategory={categoryInput}
                            onSelect={(name) => setCategoryInput(name)}
                            onAddCategory={handleCreateCategory}
                            onDeleteCategory={(id) => {
                                deleteCategory(id);
                                if (categories.find(c => c.id === id)?.name === categoryInput) {
                                    setCategoryInput('');
                                }
                            }}
                            type={type}
                            error={errors.category}
                        />

                        {/* Account Select with Add Custom */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Membro')}</label>
                                <select
                                    value={memberId || ''}
                                    onChange={(e) => setMemberId(e.target.value || '')}
                                    className="w-full h-14 px-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none"
                                >
                                    <option value="">{t('Família (Geral)')}</option>
                                    {familyMembers.map(member => (
                                        <option key={member.id} value={member.id}>{member.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Conta / Método')}</label>
                                {isCreatingAccount ? (
                                    <div className="flex gap-1">
                                        <input
                                            value={newAccountName}
                                            onChange={e => setNewAccountName(e.target.value)}
                                            placeholder={t('Nome (Ex: Pix)')}
                                            className="flex-1 h-14 px-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-l-2xl outline-none text-sm dark:text-white"
                                        />
                                        <button onClick={handleCreateAccount} className="px-2 bg-black dark:bg-[#D7FF00] text-white dark:text-[#080B12] text-xs rounded-r-2xl font-bold">{t('Criar')}</button>
                                        <button onClick={() => setIsCreatingAccount(false)} className="px-2 border dark:border-neutral-700 rounded-2xl text-xs dark:text-white"><X size={14} /></button>
                                    </div>
                                ) : (
                                    <select
                                        value={accountId}
                                        onChange={(e) => {
                                            if (e.target.value === 'NEW_ACCOUNT') setIsCreatingAccount(true);
                                            else setAccountId(e.target.value);
                                        }}
                                        className={cn(
                                            "w-full h-14 px-4 bg-white dark:bg-neutral-800 border rounded-2xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                            errors.accountId ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                                        )}
                                    >
                                        <option value="">{t('Selecione...')}</option>
                                        <optgroup label={t('Contas / Métodos')} className="dark:bg-neutral-800">
                                            {bankAccounts.map(acc => (
                                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                                            ))}
                                            {!bankAccounts.some(a => a.name.toLowerCase() === 'dinheiro') && (
                                                <option value="CASH">💵 {t('Dinheiro (Espécie)')}</option>
                                            )}
                                            <option value="NEW_ACCOUNT">{t('+ Adicionar Modo/Conta')}</option>
                                        </optgroup>
                                        <optgroup label={t('Cartões de Crédito')} className="dark:bg-neutral-800">
                                            {creditCards.map(card => (
                                                <option key={card.id} value={card.id}>{card.brand} {card.name}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                )}
                                {errors.accountId && <p className="text-red-500 text-xs mt-1">{errors.accountId}</p>}
                            </div>
                        </div>

                        {/* Installments & Recurring */}
                        {showInstallments && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Parcelamento')}</label>
                                <select
                                    value={installments}
                                    onChange={(e) => setInstallments(parseInt(e.target.value))}
                                    disabled={isRecurring}
                                    className="w-full h-14 px-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl outline-none disabled:opacity-50 dark:text-white"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                                        <option key={n} value={n}>{n}x</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-2xl p-4 transition-colors">
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
                                    <p className="font-bold text-neutral-1100 dark:text-white transition-colors">
                                        {type === 'income' ? t('Receita Recorrente') : t('Despesa Recorrente')}
                                    </p>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 transition-colors">
                                        {type === 'income'
                                            ? t('Salários, aluguéis recebidos ou bônus mensais')
                                            : t('Contas mensais (Netflix, Internet, Aluguel)')}
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0 transition-colors">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                        {t('Cancelar')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 rounded-full bg-neutral-1100 dark:bg-[#D7FF00] text-white dark:text-[#080B12] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                    >
                        {t('Salvar Transação')}
                    </button>
                </div>
            </div>
        </div>
    );
}
