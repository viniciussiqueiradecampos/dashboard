import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useFinance } from '@/contexts/FinanceContext';
import { User, Plus, DollarSign, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AddMemberModal } from '@/components/modals/AddMemberModal';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';

export function Profile() {
    const { familyMembers, deleteMember } = useFinance();
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

    const handleDeleteMember = () => {
        if (memberToDelete) {
            deleteMember(memberToDelete);
            setMemberToDelete(null);
        }
    };

    return (
        <div className="flex flex-col w-full h-full">
            <DashboardHeader />

            <div className="flex items-center justify-between mb-8 mt-4">
                <h2 className="text-2xl font-bold text-neutral-1100">Perfil e Família</h2>
                <button
                    onClick={() => setIsAddMemberOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-1100 text-white rounded-full hover:bg-neutral-800 transition-colors"
                >
                    <Plus size={18} />
                    <span>Adicionar Membro</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {familyMembers.map(member => (
                    <div key={member.id} className="relative bg-white p-6 rounded-[24px] border border-neutral-200 shadow-sm flex flex-col items-center text-center group">
                        <button
                            onClick={() => setMemberToDelete(member.id)}
                            className="absolute top-4 right-4 text-neutral-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remover membro e seus dados"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-sm">
                            {member.avatarUrl ? (
                                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-neutral-400" />
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-neutral-1100 mb-1">{member.name}</h3>
                        <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium mb-4">
                            {member.role === 'admin' ? 'Administrador' : 'Membro'}
                        </span>

                        <div className="w-full space-y-3 mt-2">
                            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                                <span className="text-sm text-neutral-500 flex items-center gap-2">
                                    <DollarSign size={16} /> Renda Mensal
                                </span>
                                <span className="font-semibold text-neutral-900">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(member.income || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AddMemberModal
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
            />

            <ConfirmDeleteModal
                isOpen={!!memberToDelete}
                onClose={() => setMemberToDelete(null)}
                onConfirm={handleDeleteMember}
                title="Remover Membro"
                message="Tem certeza que deseja remover este membro? Todos os dados vinculados a ele (transações, etc) serão apagados permanentemente."
                confirmLabel="Remover Membro"
            />
        </div>
    );
}
