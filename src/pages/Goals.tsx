import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useFinance } from '@/contexts/FinanceContext';
import { Plus, Target, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { NewGoalModal } from '@/components/modals/NewGoalModal';
import { Goal } from '@/types';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function Goals() {
    const { goals, deleteGoal } = useFinance();
    const { formatCurrency } = useSettings();
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

    const handleOpenModal = (goal: Goal | null = null) => {
        setEditingGoal(goal);
        setIsModalOpen(true);
    };

    const handleDeleteGoal = () => {
        if (goalToDelete) {
            deleteGoal(goalToDelete);
            setGoalToDelete(null);
        }
    };

    return (
        <div className="flex flex-col w-full h-full pb-32">
            <DashboardHeader />

            <div className="flex items-center justify-between mb-8 mt-4">
                <h2 className="text-2xl font-bold text-neutral-1100 dark:text-white transition-colors">{t('Meus Objetivos')}</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-1100 dark:bg-[#D7FF00] text-white dark:text-[#080B12] rounded-full hover:bg-neutral-800 transition-colors font-bold"
                >
                    <Plus size={18} />
                    <span>{t('Novo Objetivo')}</span>
                </button>
            </div>

            {goals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => (
                        <div
                            key={goal.id}
                            className="bg-white p-6 rounded-[24px] border border-neutral-200 shadow-sm hover:border-black transition-all group overflow-hidden"
                        >
                            <div className="relative h-32 -mx-6 -mt-6 mb-4 bg-neutral-100 overflow-hidden">
                                {goal.imageUrl ? (
                                    <img src={goal.imageUrl} alt={goal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Target size={32} className="text-neutral-300" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(goal)}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Target size={18} className="text-neutral-900" />
                                    </button>
                                    <button
                                        onClick={() => setGoalToDelete(goal.id)}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:text-red-500 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-600 rounded-full text-xs font-bold shadow-sm">
                                        {goal.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-neutral-1100">{goal.name}</h3>
                                <span className="text-xs font-medium text-neutral-500">
                                    {new Date(goal.deadline).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex items-end gap-1 mb-4">
                                <span className="text-2xl font-bold text-neutral-1100 dark:text-white">
                                    {formatCurrency(goal.currentAmount)}
                                </span>
                                <span className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                                    {t('de')} {formatCurrency(goal.targetAmount)}
                                </span>
                            </div>
                            <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden mb-1">
                                <div
                                    className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Progresso</span>
                                <span className="text-[10px] font-bold text-neutral-900">
                                    {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-neutral-900 rounded-[32px] border border-dashed border-neutral-300 dark:border-neutral-800 transition-colors">
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-full mb-4 transition-colors">
                        <Target size={32} className="text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-1 transition-colors">{t('Nenhum objetivo encontrado')}</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-6 transition-colors">{t('Defina metas financeiras para realizar seus sonhos.')}</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-6 py-2 bg-neutral-1100 dark:bg-[#D7FF00] text-white dark:text-[#080B12] rounded-full hover:bg-neutral-800 transition-colors font-bold"
                    >
                        {t('Criar primeiro objetivo')}
                    </button>
                </div>
            )}

            <NewGoalModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingGoal(null);
                }}
                editingGoal={editingGoal}
            />

            <ConfirmDeleteModal
                isOpen={!!goalToDelete}
                onClose={() => setGoalToDelete(null)}
                onConfirm={handleDeleteGoal}
                title="Excluir Objetivo"
                message="Tem certeza que deseja excluir este objetivo? Esta ação não pode ser desfeita."
                confirmLabel="Excluir Objetivo"
            />
        </div>
    );
}
