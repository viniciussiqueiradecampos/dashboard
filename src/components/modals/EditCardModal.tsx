import { X, CreditCard as CardIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { CreditCard, CreditCardTheme } from '@/types';

interface EditCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: CreditCard | null;
}

export function EditCardModal({ isOpen, onClose, card }: EditCardModalProps) {
    const { updateCard, deleteCard } = useFinance();

    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [last4Digits, setLast4Digits] = useState('');
    const [limit, setLimit] = useState('');
    const [closingDay, setClosingDay] = useState('');
    const [dueDay, setDueDay] = useState('');
    const [theme, setTheme] = useState<CreditCardTheme>('black');
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Load card data when modal opens
    useEffect(() => {
        if (isOpen && card) {
            setName(card.name);
            setBrand(card.brand);
            setLast4Digits(card.last4Digits);
            setLimit(card.limit.toString());
            setClosingDay(card.closingDay.toString());
            setDueDay(card.dueDay.toString());
            setTheme(card.theme);
            setImageUrl(card.imageUrl || '');
        }
    }, [isOpen, card]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!name || name.length < 3) {
            newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
        }

        if (!brand) {
            newErrors.brand = 'Informe o banco/bandeira';
        }

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate() || !card) return;

        updateCard(card.id, {
            name,
            brand,
            last4Digits: last4Digits || '0000',
            limit: parseFloat(limit),
            closingDay: parseInt(closingDay),
            dueDay: parseInt(dueDay),
            theme,
            imageUrl: imageUrl || undefined
        });

        onClose();
    };

    const handleDelete = () => {
        if (!card) return;
        deleteCard(card.id);
        setShowDeleteConfirm(false);
        onClose();
    };

    if (!isOpen || !card) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-neutral-950 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col relative border border-transparent dark:border-neutral-800 transition-colors duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            theme === 'black' ? 'bg-neutral-1100 dark:bg-neutral-800' : theme === 'lime' ? 'bg-[#D7FF00]' : 'bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700'
                        )}>
                            <CardIcon size={20} className={theme === 'black' ? 'text-white' : 'text-neutral-1100 dark:text-white'} />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-1100 dark:text-white transition-colors">Editar Cartão</h2>
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
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Nome do Cartão</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white dark:bg-neutral-800 border rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                errors.name ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                            )}
                            placeholder="Ex: Nubank Mastercard"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

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
                            Últimos 4 Dígitos
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
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shrink-0 transition-colors">
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-2.5 rounded-full border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                        Excluir Cartão
                    </button>
                    <div className="flex gap-3">
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
                            Salvar Alterações
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Overlay */}
                {showDeleteConfirm && (
                    <div className="absolute inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center p-6 rounded-3xl backdrop-blur-sm">
                        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-xl max-w-sm w-full border border-transparent dark:border-neutral-800">
                            <h3 className="text-lg font-bold text-neutral-1100 dark:text-white mb-2 transition-colors">Confirmar Exclusão</h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6 transition-colors">
                                Tem certeza que deseja excluir o cartão "{card.name}"? Esta ação não pode ser desfeita.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-2.5 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
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
