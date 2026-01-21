import { X, Upload, Camera, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { uploadFile } from '@/lib/supabase';
import { FamilyMember } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingMember?: FamilyMember | null;
}

const ROLE_SUGGESTIONS = ['Pai', 'Mãe', 'Filho', 'Filha', 'Avô', 'Avó', 'Tio', 'Tia'];

export function AddMemberModal({ isOpen, onClose, editingMember }: AddMemberModalProps) {
    const { addMember, updateMember, deleteMemberTransactions, refreshData } = useFinance();
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [income, setIncome] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editingMember) {
            setName(editingMember.name);
            setRole(editingMember.role);
            setAvatarUrl(editingMember.avatarUrl || '');
            setIncome(editingMember.income?.toString() || '');
        } else {
            setName('');
            setRole('');
            setAvatarUrl('');
            setIncome('');
        }
    }, [editingMember, isOpen]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Create a unique path for the avatar
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const path = `members/${fileName}`;

            const url = await uploadFile('avatars', path, file);
            setAvatarUrl(url);
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            const msg = error.message || 'Erro desconhecido';
            alert(`Erro no upload: ${msg}. Verifique se o bucket "avatars" é público e tem permissões de escrita.`);
        } finally {
            setIsUploading(false);
        }
    };

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

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const memberData = {
                name,
                role,
                avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D7FF00&color=080B12`,
                income: income ? parseFloat(income) : 0,
            };

            if (editingMember) {
                await updateMember(editingMember.id, memberData);
            } else {
                await addMember(memberData);
            }

            // Reset form
            setName('');
            setRole('');
            setAvatarUrl('');
            setIncome('');
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Error saving member:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <h2 className="text-xl font-bold text-neutral-1100 dark:text-white">
                        {editingMember ? t('Editar Membro') : t('Adicionar Membro da Família')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors dark:text-neutral-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] bg-white dark:bg-neutral-900">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center justify-center mb-4">
                        <div
                            className="relative w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center overflow-hidden group cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
                            ) : avatarUrl ? (
                                <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Camera className="w-8 h-8 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
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
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">{t('Clique para carregar uma foto')}</p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            {t('Nome Completo')}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white dark:bg-neutral-800 border rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                errors.name ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                            )}
                            placeholder={t('Ex: João Silva')}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            {t('Função na Família')}
                        </label>
                        <input
                            type="text"
                            list="role-suggestions"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className={cn(
                                "w-full h-12 px-4 bg-white dark:bg-neutral-800 border rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none",
                                errors.role ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                            )}
                            placeholder={t('Ex: Pai, Mãe, Filho...')}
                        />
                        <datalist id="role-suggestions">
                            {ROLE_SUGGESTIONS.map(suggestion => (
                                <option key={suggestion} value={suggestion} />
                            ))}
                        </datalist>
                        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                    </div>

                    {/* Income */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            {t('Renda Mensal Estimada (Opcional)')}
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">R$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={income}
                                onChange={(e) => setIncome(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-1100 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-[#D7FF00] focus:border-transparent transition-all outline-none"
                                placeholder="0,00"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                    <div>
                        {editingMember && (
                            <button
                                onClick={async () => {
                                    if (confirm(`${t('Tem certeza que deseja zerar todas as transações de')} ${editingMember.name}?`)) {
                                        await deleteMemberTransactions(editingMember.id);
                                        await refreshData();
                                        onClose();
                                    }
                                }}
                                className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium border border-transparent hover:border-red-200 dark:hover:border-red-800"
                            >
                                {t('Zerar Dados')}
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                        >
                            {t('Cancelar')}
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || isUploading}
                            className="px-6 py-2.5 rounded-full bg-neutral-1100 dark:bg-[#D7FF00] text-white dark:text-[#080B12] font-semibold hover:bg-neutral-900 dark:hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {(isSubmitting || isUploading) && <Loader2 size={18} className="animate-spin" />}
                            {editingMember ? t('Salvar Alterações') : t('Adicionar Membro')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
