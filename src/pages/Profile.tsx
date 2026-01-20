import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useFinance } from '@/contexts/FinanceContext';
import { User, Plus, DollarSign, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { AddMemberModal } from '@/components/modals/AddMemberModal';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { FamilyMember } from '@/types';

export function Profile() {
    const { familyMembers, deleteMember } = useFinance();
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
                <h2 className="text-2xl font-bold text-neutral-1100">Perfil e Família</h2>
                <button
                    onClick={() => {
                        setEditingMember(null);
                        setIsAddMemberOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-1100 text-white rounded-full hover:bg-neutral-800 transition-colors"
                >
                    <Plus size={18} />
                    <span>Adicionar Membro</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {familyMembers.map(member => (
                    <div key={member.id} className="relative bg-white p-6 rounded-[32px] border border-neutral-200 shadow-sm flex flex-col items-center text-center group hover:border-black transition-all">
                        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEditMember(member)}
                                className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-all"
                                title="Editar membro"
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={() => setMemberToDelete(member.id)}
                                className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Remover membro"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-sm group-hover:scale-105 transition-transform">
                            {member.avatarUrl ? (
                                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-neutral-400" />
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-neutral-1100 mb-1">{member.name}</h3>
                        <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-bold mb-4">
                            {member.role}
                        </span>

                        <div className="w-full space-y-3 mt-2">
                            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                                    <DollarSign size={14} /> Renda
                                </span>
                                <span className="font-bold text-neutral-1100">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(member.income || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
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
                title="Remover Membro"
                message="Tem certeza que deseja remover este membro? Todos os dados vinculados a ele (transações, etc) serão apagados permanentemente."
                confirmLabel="Remover Membro"
            />
        </div>
    );
}
