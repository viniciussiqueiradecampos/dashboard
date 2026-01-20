import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useFinance } from '@/contexts/FinanceContext';
import { Plus, Target } from 'lucide-react';

export function Goals() {
    const { goals } = useFinance();

    return (
        <div className="flex flex-col w-full h-full">
            <DashboardHeader />

            <div className="flex items-center justify-between mb-8 mt-4">
                <h2 className="text-2xl font-bold text-neutral-1100">Meus Objetivos</h2>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-1100 text-white rounded-full hover:bg-neutral-800 transition-colors"
                >
                    <Plus size={18} />
                    <span>Novo Objetivo</span>
                </button>
            </div>

            {goals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => (
                        <div key={goal.id} className="bg-white p-6 rounded-[24px] border border-neutral-200 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-neutral-100 rounded-full">
                                    <Target size={24} className="text-neutral-900" />
                                </div>
                                <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
                                    {new Date(goal.deadline).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-neutral-1100 mb-2">{goal.name}</h3>
                            <div className="flex items-end gap-1 mb-4">
                                <span className="text-2xl font-bold text-neutral-1100">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.currentAmount)}
                                </span>
                                <span className="text-sm text-neutral-500 mb-1">
                                    de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.targetAmount)}
                                </span>
                            </div>
                            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[32px] border border-dashed border-neutral-300">
                    <div className="p-4 bg-neutral-50 rounded-full mb-4">
                        <Target size={32} className="text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-1">Nenhum objetivo encontrado</h3>
                    <p className="text-neutral-500 mb-6">Defina metas financeiras para realizar seus sonhos.</p>
                    <button className="px-6 py-2 bg-neutral-1100 text-white rounded-full hover:bg-neutral-800 transition-colors">
                        Criar primeiro objetivo
                    </button>
                </div>
            )}
        </div>
    );
}
