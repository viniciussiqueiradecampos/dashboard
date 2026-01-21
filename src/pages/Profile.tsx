import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useFinance } from '@/contexts/FinanceContext';
import { useSettings } from '@/contexts/SettingsContext';
import { User, Plus, DollarSign, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { AddMemberModal } from '@/components/modals/AddMemberModal';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { FamilyMember } from '@/types';

export function Profile() {
    const { familyMembers, deleteMember, resetAllData } = useFinance();
    const { formatCurrency } = useSettings();
    const { t } = useLanguage();
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

    const handleDeleteMember = () => {
        if (memberToDelete) {
            deleteMember(memberToDelete);
            setMemberToDelete(null);
        }
    };

    const handleEditMember = (member: FamilyMember) => {
        setEditingMember(member);
        setIsAddMemberOpen(true);
    };

    return (
        <div className="flex flex-col w-full h-full pb-32">
            <DashboardHeader />

            <div className="flex items-center justify-between mb-8 mt-4">
                <h2 className="text-2xl font-bold text-neutral-1100 dark:text-white transition-colors">{t('Perfil e Família')}</h2>
                <button
                    onClick={() => {
                        setEditingMember(null);
                        setIsAddMemberOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-1100 dark:bg-[#D7FF00] text-white dark:text-[#080B12] rounded-full hover:bg-neutral-800 transition-colors font-bold"
                >
                    <Plus size={18} />
                    <span>{t('Adicionar Membro')}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {familyMembers.map(member => (
                    <div key={member.id} className="relative bg-white dark:bg-neutral-900 p-6 rounded-[32px] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col items-center text-center group hover:border-black dark:hover:border-[#D7FF00] transition-all">
                        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEditMember(member)}
                                className="p-2 text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all"
                                title={t('Editar membro')}
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={() => setMemberToDelete(member.id)}
                                className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all"
                                title={t('Remover membro')}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 overflow-hidden border-4 border-white dark:border-neutral-950 shadow-sm group-hover:scale-105 transition-transform">
                            {member.avatarUrl ? (
                                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-neutral-400" />
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-neutral-1100 dark:text-white mb-1 transition-colors">{member.name}</h3>
                        <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full text-xs font-bold mb-4 transition-colors">
                            {member.role === 'Membro' ? t('Membro') : member.role}
                        </span>

                        <div className="w-full space-y-3 mt-2">
                            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 transition-colors">
                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                                    <DollarSign size={14} /> {t('Renda')}
                                </span>
                                <span className="font-bold text-neutral-1100 dark:text-white transition-colors">
                                    {formatCurrency(member.income || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-[24px] border border-red-200 dark:border-red-900/50 p-6 shadow-sm lg:col-span-1 mt-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                        <Trash2 size={20} className="text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-red-600 dark:text-red-400">{t('settings.dangerTitle')}</h3>
                        <p className="text-sm text-red-500/80">
                            {t('settings.dangerDescription')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-neutral-950 rounded-2xl border border-red-100 dark:border-red-900/30">
                    <button
                        onClick={async () => {
                            if (confirm(t('settings.confirmReset'))) {
                                await resetAllData();
                            }
                        }}
                        className="w-full px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20"
                    >
                        {t('settings.resetBtn')}
                    </button>
                </div>
            </div>

            <AddMemberModal
                isOpen={isAddMemberOpen}
                onClose={() => {
                    setIsAddMemberOpen(false);
                    setEditingMember(null);
                }}
                editingMember={editingMember}
            />

            <ConfirmDeleteModal
                isOpen={!!memberToDelete}
                onClose={() => setMemberToDelete(null)}
                onConfirm={handleDeleteMember}
                title={t('Remover Membro')}
                message={t('Tem certeza que deseja remover este membro? Todos os dados vinculados a ele (transações, etc) serão apagados permanentemente.')}
                confirmLabel={t('Remover Membro')}
            />
        </div>
    );
}
