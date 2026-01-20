import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { CreditCardTheme } from '@/types';
import { uploadFile } from '@/lib/supabase';

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddAccountModal({ isOpen, onClose }: AddAccountModalProps) {
    const { addAccount, addCard, familyMembers } = useFinance();
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    const [imageUrl, setImageUrl] = useState('');

    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileName = `${Date.now()}-${file.name}`;
            const url = await uploadFile('logos', fileName, file);
            setImageUrl(url);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erro ao fazer upload da imagem. Certifique-se que o bucket "logos" existe no Supabase.');
        } finally {
            setIsUploading(false);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!name || name.length < 3) {
            newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
        }

        if (accountType === 'card' && !holderId) {
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
                bankName: brand || 'Outros',
                holderId: holderId || undefined
            });
        } else {
            addCard({
                name,
                brand: brand || 'Outros',
                last4Digits: last4Digits || '0000',
                limit: parseFloat(limit),
                currentInvoice: 0,
                closingDay: parseInt(closingDay),
                dueDay: parseInt(dueDay),
                theme,
                holderId,
                imageUrl: imageUrl || undefined
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
        setImageUrl('');
        setErrors({});

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-neutral-950 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col border border-transparent dark:border-neutral-800 transition-colors duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                    <h2 className="text-xl font-bold text-neutral-1100 dark:text-white transition-colors">Adicionar Conta/Cartão</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors dark:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white dark:bg-neutral-950">
                    {/* Type Toggle */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-2xl">
                        <button
                            onClick={() => setAccountType('account')}
                            className={cn(
                                "h-12 rounded-xl font-medium transition-all",
                                accountType === 'account'
                                    ? 'bg-neutral-1100 dark:bg-[#D7FF00] text-white dark:text-[#080B12] shadow-sm'
                                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                            )}
                        >
                            Conta Bancária
                        </button>
                        <button
                            onClick={() => setAccountType('card')}
                            className={cn(
                                "h-12 rounded-xl font-medium transition-all",
                                accountType === 'card'
                                    ? 'bg-neutral-1100 dark:bg-[#D7FF00] text-white dark:text-[#080B12] shadow-sm'
                                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                            )}
                        >
                            Cartão de Crédito
                        </button>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            {accountType === 'account' ? 'Nome da Conta' : 'Nome do Cartão'}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white dark:bg-neutral-800 border rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                errors.name ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                            )}
                            placeholder={accountType === 'account' ? 'Ex: Nubank Conta' : 'Ex: Nubank Mastercard'}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Holder */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Titular {accountType === 'card' && <span className="text-red-500">*</span>}
                        </label>
                        <select
                            value={holderId}
                            onChange={(e) => setHolderId(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white dark:bg-neutral-800 border rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none appearance-none",
                                errors.holderId ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                            )}
                        >
                            <option value="">{familyMembers.length > 0 ? "Selecione o titular" : "Nenhum membro cadastrado"}</option>
                            {familyMembers.map(member => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                        </select>
                        {familyMembers.length === 0 && (
                            <p className="text-amber-600 dark:text-amber-500 text-[11px] mt-1 font-medium">
                                Você precisa adicionar um membro da família no Perfil antes de criar um cartão.
                            </p>
                        )}
                        {errors.holderId && <p className="text-red-500 text-xs mt-1">{errors.holderId}</p>}
                    </div>

                    {/* Account-specific fields */}
                    {accountType === 'account' && (
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Saldo Inicial</label>
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
                    )}

                    {/* Card-specific fields */}
                    {accountType === 'card' && (
                        <>
                            {/* Brand */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Banco</label>
                                <input
                                    type="text"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className={cn(
                                        "w-full h-12 px-4 bg-white dark:bg-neutral-800 border rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                        errors.brand ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                                    )}
                                    placeholder="Ex: Nubank, Inter, XP"
                                />
                                {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
                            </div>

                            {/* Last 4 Digits */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                    Últimos 4 Dígitos (Opcional)
                                </label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={last4Digits}
                                    onChange={(e) => setLast4Digits(e.target.value.replace(/\D/g, ''))}
                                    className="w-full h-12 px-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none"
                                    placeholder="5897"
                                />
                            </div>

                            {/* Limit */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Limite Total</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={limit}
                                        onChange={(e) => setLimit(e.target.value)}
                                        className={cn(
                                            "w-full h-12 pl-12 pr-4 bg-white dark:bg-neutral-800 border rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                            errors.limit ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                                        )}
                                        placeholder="0,00"
                                    />
                                </div>
                                {errors.limit && <p className="text-red-500 text-xs mt-1">{errors.limit}</p>}
                            </div>

                            {/* Closing & Due Days */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Dia de Fechamento</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={closingDay}
                                        onChange={(e) => setClosingDay(e.target.value)}
                                        className={cn(
                                            "w-full h-12 px-4 bg-white dark:bg-neutral-800 border rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                            errors.closingDay ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                                        )}
                                        placeholder="1 a 31"
                                    />
                                    {errors.closingDay && <p className="text-red-500 text-xs mt-1">{errors.closingDay}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Dia de Vencimento</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={dueDay}
                                        onChange={(e) => setDueDay(e.target.value)}
                                        className={cn(
                                            "w-full h-12 px-4 bg-white dark:bg-neutral-800 border rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                            errors.dueDay ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                                        )}
                                        placeholder="1 a 31"
                                    />
                                    {errors.dueDay && <p className="text-red-500 text-xs mt-1">{errors.dueDay}</p>}
                                </div>
                            </div>

                            {/* Theme */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Tema Visual</label>
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
                                            "h-16 rounded-xl bg-white dark:bg-neutral-700 border-2 transition-all",
                                            theme === 'white' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-neutral-300 dark:border-neutral-600'
                                        )}
                                    >
                                        <span className="text-neutral-1100 dark:text-white text-xs font-medium">White</span>
                                    </button>
                                </div>
                            </div>

                            {/* Logo Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">URL do Logotipo (Opcional)</label>
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full h-12 px-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none"
                                    placeholder="https://exemplo.com/logo.png"
                                />
                                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">Insira o link para a imagem do logotipo do banco.</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shrink-0 transition-colors">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 rounded-full bg-neutral-1100 dark:bg-[#D7FF00] text-white dark:text-[#080B12] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
}
