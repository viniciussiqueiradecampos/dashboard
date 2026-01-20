import { X, Target, Calendar, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';

interface NewGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORY_SUGGESTIONS = ['Viagem', 'Carro', 'Casa', 'Reserva de Emergência', 'Investimentos', 'Estudos', 'Eletrônicos'];

export function NewGoalModal({ isOpen, onClose }: NewGoalModalProps) {
    const { addGoal } = useFinance();

    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [category, setCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!name || name.length < 3) {
            newErrors.name = 'Nome do objetivo é obrigatório';
        }
        if (!targetAmount || parseFloat(targetAmount) <= 0) {
            newErrors.targetAmount = 'Valor meta deve ser maior que zero';
        }
        if (!deadline) {
            newErrors.deadline = 'Data limite é obrigatória';
        }
        if (!category) {
            newErrors.category = 'Categoria é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await addGoal({
                name,
                targetAmount: parseFloat(targetAmount),
                currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
                deadline,
                category,
            });

            // Reset form
            setName('');
            setTargetAmount('');
            setCurrentAmount('');
            setDeadline('');
            setCategory('');
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Error adding goal:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-900 rounded-lg">
                            <Target className="text-white" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-1100">Novo Objetivo</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Nome do Objetivo
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                errors.name ? 'border-red-500' : 'border-neutral-300'
                            )}
                            placeholder="Ex: Viagem para o Japão"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Target Amount */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Valor Meta
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">R$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    className={cn(
                                        "w-full h-12 pl-10 pr-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                        errors.targetAmount ? 'border-red-500' : 'border-neutral-300'
                                    )}
                                    placeholder="0,00"
                                />
                            </div>
                            {errors.targetAmount && <p className="text-red-500 text-xs mt-1">{errors.targetAmount}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Já Guardado
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">R$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={currentAmount}
                                    onChange={(e) => setCurrentAmount(e.target.value)}
                                    className="w-full h-12 pl-10 pr-4 bg-white border border-neutral-300 rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                                    placeholder="0,00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Deadline */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Data Limite
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className={cn(
                                        "w-full h-12 pl-12 pr-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                        errors.deadline ? 'border-red-500' : 'border-neutral-300'
                                    )}
                                />
                            </div>
                            {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Categoria
                            </label>
                            <input
                                type="text"
                                list="goal-category-suggestions"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={cn(
                                    "w-full h-12 px-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                    errors.category ? 'border-red-500' : 'border-neutral-300'
                                )}
                                placeholder="Ex: Viagem"
                            />
                            <datalist id="goal-category-suggestions">
                                {CATEGORY_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                            </datalist>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-100 bg-neutral-50/50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full border border-neutral-300 text-neutral-700 font-medium hover:bg-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-full bg-neutral-1100 text-white font-medium hover:bg-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                        Criar Objetivo
                    </button>
                </div>
            </div>
        </div>
    );
}
