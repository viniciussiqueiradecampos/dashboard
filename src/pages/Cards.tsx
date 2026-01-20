import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CreditCardsWidget } from '@/components/dashboard/CreditCardsWidget';
import { AddAccountModal } from '@/components/modals/AddAccountModal';
import { useState } from 'react';
import { Plus } from 'lucide-react';

export function Cards() {
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    // const { creditCards } = useFinance();

    return (
        <div className="flex flex-col w-full h-full">
            <DashboardHeader />

            <div className="flex items-center justify-between mb-8 mt-4">
                <h2 className="text-2xl font-bold text-neutral-1100">Meus Cartões</h2>
                <button
                    onClick={() => setIsAddCardOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-1100 text-white rounded-full hover:bg-neutral-800 transition-colors"
                >
                    <Plus size={18} />
                    <span>Novo Cartão</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Reutilizando a lógica de renderização de cards do widget ou criando novos cards visuais */}
                <div className="md:col-span-2 lg:col-span-3">
                    <CreditCardsWidget />
                </div>
            </div>

            <AddAccountModal
                isOpen={isAddCardOpen}
                onClose={() => setIsAddCardOpen(false)}
            />
        </div>
    );
}
