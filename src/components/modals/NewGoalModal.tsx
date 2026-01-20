import { X, Target, Calendar, Loader2, Upload, Camera } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { Goal } from '@/types';
import { uploadFile } from '@/lib/supabase';

interface NewGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingGoal?: Goal | null;
}

const CATEGORY_SUGGESTIONS = ['Viagem', 'Carro', 'Casa', 'Reserva de Emergência', 'Investimentos', 'Estudos', 'Eletrônicos'];

export function NewGoalModal({ isOpen, onClose, editingGoal }: NewGoalModalProps) {
    const { addGoal, updateGoal } = useFinance();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editingGoal) {
            setName(editingGoal.name);
            setTargetAmount(editingGoal.targetAmount.toString());
            setCurrentAmount(editingGoal.currentAmount.toString());
            setDeadline(editingGoal.deadline);
            setCategory(editingGoal.category);
            setImageUrl(editingGoal.imageUrl || '');
        } else {
            setName('');
            setTargetAmount('');
            setCurrentAmount('');
            setDeadline('');
            setCategory('');
            setImageUrl('');
        }
    }, [editingGoal, isOpen]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `goal_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const path = `goals/${fileName}`;

            const url = await uploadFile('avatars', path, file); // Reusing avatars bucket or create goals bucket
            setImageUrl(url);
        } catch (error: any) {
            console.error('Error uploading goal image:', error);
            alert(`Erro no upload: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

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
            const goalData = {
                name,
                targetAmount: parseFloat(targetAmount),
                currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
                deadline,
                category,
                imageUrl,
            };

            if (editingGoal) {
                await updateGoal(editingGoal.id, goalData);
            } else {
                await addGoal(goalData);
            }

            onClose();
        } catch (error) {
            console.error('Error saving goal:', error);
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
                        <h2 className="text-xl font-bold text-neutral-1100">
                            {editingGoal ? 'Editar Objetivo' : 'Novo Objetivo'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                    {/* Image Upload */}
                    <div className="flex flex-col items-center justify-center mb-4">
                        <div
                            className="relative w-full h-32 rounded-2xl bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden group cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
                            ) : imageUrl ? (
                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <Camera className="w-8 h-8 text-neutral-400 mx-auto mb-1 group-hover:text-neutral-600 transition-colors" />
                                    <p className="text-xs text-neutral-500 font-medium">Foto do Objetivo</p>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

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
