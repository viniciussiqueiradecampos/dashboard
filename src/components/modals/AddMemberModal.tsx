import { X } from 'lucide-react';
import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ROLE_SUGGESTIONS = ['Pai', 'Mãe', 'Filho', 'Filha', 'Avô', 'Avó', 'Tio', 'Tia'];

export function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
    const { addMember } = useFinance();

    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [income, setIncome] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!name || name.length < 3) {
            newErrors.name = 'Por favor, insira um nome válido';
        }

        if (!role) {
            newErrors.role = 'Por favor, informe a função na família';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        addMember({
            name,
            role: role as any,
            avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D7FF00&color=080B12`,
            income: income ? parseFloat(income) : undefined,
        });

        // Reset form
        setName('');
        setRole('');
        setAvatarUrl('');
        setIncome('');
        setErrors({});

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                    <h2 className="text-xl font-bold text-neutral-1100">Adicionar Membro da Família</h2>
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
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                errors.name ? 'border-red-500' : 'border-neutral-300'
                            )}
                            placeholder="Ex: João Silva"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Função na Família
                        </label>
                        <input
                            type="text"
                            list="role-suggestions"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white border rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none",
                                errors.role ? 'border-red-500' : 'border-neutral-300'
                            )}
                            placeholder="Ex: Pai, Mãe, Filho..."
                        />
                        <datalist id="role-suggestions">
                            {ROLE_SUGGESTIONS.map(suggestion => (
                                <option key={suggestion} value={suggestion} />
                            ))}
                        </datalist>
                        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                    </div>

                    {/* Avatar URL */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Avatar (Opcional)
                        </label>
                        <input
                            type="url"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className="w-full h-12 px-4 bg-white border border-neutral-300 rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                            placeholder="https://exemplo.com/foto.jpg"
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                            Cole a URL de uma imagem ou deixe em branco para usar avatar padrão
                        </p>
                    </div>

                    {/* Income */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Renda Mensal Estimada (Opcional)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">R$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={income}
                                onChange={(e) => setIncome(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-white border border-neutral-300 rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                                placeholder="0,00"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 bg-neutral-50">
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
                        Adicionar Membro
                    </button>
                </div>
            </div>
        </div>
    );
}
