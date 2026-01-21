import { X, LayoutDashboard, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { BankAccount } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface EditAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    account: BankAccount | null;
}

export function EditAccountModal({ isOpen, onClose, account }: EditAccountModalProps) {
    const { updateAccount, deleteAccount } = useFinance();
    const { t } = useLanguage();

    const [name, setName] = useState('');
    const [bankName, setBankName] = useState('');
    const [balance, setBalance] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && account) {
            setName(account.name);
            setBankName(account.bankName);
            setBalance(account.balance.toString());
        }
    }, [isOpen, account]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!name || name.length < 3) {
            newErrors.name = t('Nome deve ter pelo menos 3 caracteres');
        }

        if (!bankName) {
            newErrors.bankName = t('Informe o nome do banco');
        }

        if (!balance) {
            newErrors.balance = t('Saldo é obrigatório');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate() || !account) return;
        setIsSubmitting(true);
        try {
            await updateAccount(account.id, {
                name,
                bankName,
                balance: parseFloat(balance)
            });
            onClose();
        } catch (error) {
            console.error('Error updating account:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!account) return;
        setIsSubmitting(true);
        try {
            await deleteAccount(account.id);
            setShowDeleteConfirm(false);
            onClose();
        } catch (error) {
            console.error('Error deleting account:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !account) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-neutral-950 w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col relative border border-transparent dark:border-neutral-800 transition-colors duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <LayoutDashboard size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-1100 dark:text-white transition-colors">
                            {t('common.edit')}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors dark:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white dark:bg-neutral-950">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Nome da Conta')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white dark:bg-neutral-800 border rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                errors.name ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                            )}
                            placeholder="Ex: Nubank Conta"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Bank Name */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Banco')}</label>
                        <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white dark:bg-neutral-800 border rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                errors.bankName ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                            )}
                            placeholder="Ex: Nubank"
                        />
                        {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
                    </div>

                    {/* Balance */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('Saldo Atual')}</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">R$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                                className={cn(
                                    "w-full h-12 pl-12 pr-4 bg-white dark:bg-neutral-800 border rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                    errors.balance ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                                )}
                                placeholder="0,00"
                            />
                        </div>
                        {errors.balance && <p className="text-red-500 text-xs mt-1">{errors.balance}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shrink-0 transition-colors">
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-2.5 rounded-full border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                        {t('common.delete')}
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-full bg-neutral-1100 dark:bg-[#D7FF00] text-white dark:text-[#080B12] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                            {t('common.save')}
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Overlay */}
                {showDeleteConfirm && (
                    <div className="absolute inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center p-6 rounded-[32px] backdrop-blur-sm">
                        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-xl max-w-sm w-full border border-transparent dark:border-neutral-800">
                            <h3 className="text-lg font-bold text-neutral-1100 dark:text-white mb-2 transition-colors">{t('Confirmar Exclusão')}</h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6 transition-colors">
                                {t('Tem certeza que deseja excluir a conta')} "{account.name}"? {t('Esta ação não pode ser desfeita e afetará o histórico.')}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="flex-1 py-2.5 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
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
