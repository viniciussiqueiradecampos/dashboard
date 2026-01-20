import { X } from 'lucide-react';
import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { CreditCardTheme } from '@/types';

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddAccountModal({ isOpen, onClose }: AddAccountModalProps) {
    const { addAccount, addCard, familyMembers } = useFinance();

    const [accountType, setAccountType] = useState<'account' | 'card'>('account');
    const [name, setName] = useState('');
    const [holderId, setHolderId] = useState('');

    // Account fields
    const [balance, setBalance] = useState('');

    // Card fields
    const [closingDay, setClosingDay] = useState('');
    const [dueDay, setDueDay] = useState('');
    const [limit, setLimit] = useState('');
    const [last4Digits, setLast4Digits] = useState('');
    const [theme, setTheme] = useState<CreditCardTheme>('black');
    const [brand, setBrand] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!name || name.length < 3) {
            newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
        }

        if (!holderId) {
            newErrors.holderId = 'Selecione o titular';
        }

        if (accountType === 'account') {
            if (!balance || parseFloat(balance) < 0) {
                newErrors.balance = 'Saldo inicial é obrigatório';
            }
        } else {
            const closing = parseInt(closingDay);
            const due = parseInt(dueDay);

            if (!closingDay || closing < 1 || closing > 31) {
                newErrors.closingDay = 'Dia deve estar entre 1 e 31';
            }

            if (!dueDay || due < 1 || due > 31) {
                newErrors.dueDay = 'Dia deve estar entre 1 e 31';
            }

            if (!limit || parseFloat(limit) <= 0) {
                newErrors.limit = 'Limite deve ser maior que zero';
            }

            if (!brand) {
                newErrors.brand = 'Informe o banco/bandeira';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        if (accountType === 'account') {
            addAccount({
                name,
                balance: parseFloat(balance),
                bankName: holderId, // Using member name as bank name for now
            });
        } else {
            addCard({
                name,
                brand,
                last4Digits: last4Digits || '0000',
                limit: parseFloat(limit),
                currentInvoice: 0,
                closingDay: parseInt(closingDay),
                dueDay: parseInt(dueDay),
                theme,
            });
        }

        // Reset form
        setName('');
        setHolderId('');
        setBalance('');
        setClosingDay('');
        setDueDay('');
        setLimit('');
        setLast4Digits('');
        setBrand('');
        setTheme('black');
        setErrors({});

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 shrink-0">
                    <h2 className="text-xl font-bold text-neutral-1100">Adicionar Conta/Cartão</h2>
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
                            onClick={() => setAccountType('account')}
                            className={cn(
                                "h-12 rounded-xl font-medium transition-all",
                                accountType === 'account'
                                    ? 'bg-neutral-1100 text-white'
                                    : 'bg-white border border-neutral-300 text-neutral-600'
                            )}
                        >
                            Conta Bancária
                        </button>
                        <button
                            onClick={() => setAccountType('card')}
                            className={cn(
                                "h-12 rounded-xl font-medium transition-all",
                                accountType === 'card'
                                    ? 'bg-neutral-1100 text-white'
                                    : 'bg-white border border-neutral-300 text-neutral-600'
                            )}
                        >
                            Cartão de Crédito
                        </button>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            {accountType === 'account' ? 'Nome da Conta' : 'Nome do Cartão'}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                errors.name ? 'border-red-500' : 'border-neutral-300'
                            )}
                            placeholder={accountType === 'account' ? 'Ex: Nubank Conta' : 'Ex: Nubank Mastercard'}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Holder */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Titular</label>
                        <select
                            value={holderId}
                            onChange={(e) => setHolderId(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                errors.holderId ? 'border-red-500' : 'border-neutral-300'
                            )}
                        >
                            <option value="">Selecione o titular</option>
                            {familyMembers.map(member => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                        </select>
                        {errors.holderId && <p className="text-red-500 text-xs mt-1">{errors.holderId}</p>}
                    </div>

                    {/* Account-specific fields */}
                    {accountType === 'account' && (
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Saldo Inicial</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">R$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                    className={cn(
                                        "w-full h-12 pl-12 pr-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                        errors.balance ? 'border-red-500' : 'border-neutral-300'
                                    )}
                                    placeholder="0,00"
                                />
                            </div>
                            {errors.balance && <p className="text-red-500 text-xs mt-1">{errors.balance}</p>}
                        </div>
                    )}

                    {/* Card-specific fields */}
                    {accountType === 'card' && (
                        <>
                            {/* Brand */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Banco</label>
                                <input
                                    type="text"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className={cn(
                                        "w-full h-12 px-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                        errors.brand ? 'border-red-500' : 'border-neutral-300'
                                    )}
                                    placeholder="Ex: Nubank, Inter, XP"
                                />
                                {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
                            </div>

                            {/* Last 4 Digits */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Últimos 4 Dígitos (Opcional)
                                </label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={last4Digits}
                                    onChange={(e) => setLast4Digits(e.target.value.replace(/\D/g, ''))}
                                    className="w-full h-12 px-4 bg-white border border-neutral-300 rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                                    placeholder="5897"
                                />
                            </div>

                            {/* Limit */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Limite Total</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={limit}
                                        onChange={(e) => setLimit(e.target.value)}
                                        className={cn(
                                            "w-full h-12 pl-12 pr-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                            errors.limit ? 'border-red-500' : 'border-neutral-300'
                                        )}
                                        placeholder="0,00"
                                    />
                                </div>
                                {errors.limit && <p className="text-red-500 text-xs mt-1">{errors.limit}</p>}
                            </div>

                            {/* Closing & Due Days */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Dia de Fechamento</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={closingDay}
                                        onChange={(e) => setClosingDay(e.target.value)}
                                        className={cn(
                                            "w-full h-12 px-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                            errors.closingDay ? 'border-red-500' : 'border-neutral-300'
                                        )}
                                        placeholder="1 a 31"
                                    />
                                    {errors.closingDay && <p className="text-red-500 text-xs mt-1">{errors.closingDay}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Dia de Vencimento</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={dueDay}
                                        onChange={(e) => setDueDay(e.target.value)}
                                        className={cn(
                                            "w-full h-12 px-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                            errors.dueDay ? 'border-red-500' : 'border-neutral-300'
                                        )}
                                        placeholder="1 a 31"
                                    />
                                    {errors.dueDay && <p className="text-red-500 text-xs mt-1">{errors.dueDay}</p>}
                                </div>
                            </div>

                            {/* Theme */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-3">Tema Visual</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setTheme('black')}
                                        className={cn(
                                            "h-16 rounded-xl bg-neutral-1100 border-2 transition-all",
                                            theme === 'black' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
                                        )}
                                    >
                                        <span className="text-white text-xs font-medium">Black</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTheme('lime')}
                                        className={cn(
                                            "h-16 rounded-xl bg-[#D7FF00] border-2 transition-all",
                                            theme === 'lime' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
                                        )}
                                    >
                                        <span className="text-neutral-1100 text-xs font-medium">Lime</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTheme('white')}
                                        className={cn(
                                            "h-16 rounded-xl bg-white border-2 transition-all",
                                            theme === 'white' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-neutral-300'
                                        )}
                                    >
                                        <span className="text-neutral-1100 text-xs font-medium">White</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 bg-neutral-50 shrink-0">
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
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
}
