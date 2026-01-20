import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { AddMemberModal } from '@/components/modals/AddMemberModal';

export function MemberFilter() {
    const { familyMembers, filters, setFilters } = useFinance();
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

    const handleMemberToggle = (memberId: string) => {
        setFilters(prev => ({
            ...prev,
            selectedMember: prev.selectedMember === memberId ? null : memberId
        }));
    };

    return (
        <>
            <div className="flex items-center">
                <div className="flex -space-x-3 overflow-hidden">
                    {familyMembers.map((member) => {
                        const isSelected = filters.selectedMember === member.id;
                        return (
                            <button
                                key={member.id}
                                onClick={() => handleMemberToggle(member.id)}
                                className={cn(
                                    "relative inline-block h-10 w-10 rounded-full ring-2 ring-white transition-all transform hover:scale-110 hover:z-10 focus:outline-none",
                                    isSelected && "ring-neutral-1100 ring-[3px] z-10"
                                )}
                            >
                                <img
                                    className="h-full w-full rounded-full object-cover"
                                    src={member.avatarUrl}
                                    alt={member.name}
                                />
                                {isSelected && (
                                    <div className="absolute -bottom-1 -right-1 bg-brand-500 rounded-full p-0.5 border border-white shadow-sm">
                                        <Check size={10} className="text-neutral-1100" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 transition-colors"
                    title="Adicionar membro"
                >
                    <Plus size={20} />
                </button>
            </div>

            <AddMemberModal
                isOpen={isAddMemberModalOpen}
                onClose={() => setIsAddMemberModalOpen(false)}
            />
        </>
    );
}
