import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CreditCardsWidget } from '@/components/dashboard/CreditCardsWidget';
import { AddAccountModal } from '@/components/modals/AddAccountModal';
import { NewTransactionModal } from '@/components/modals/NewTransactionModal';
import { useState } from 'react';
import { Plus, ArrowRightLeft } from 'lucide-react';

export function Cards() {
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);

    return (
        <div className="flex flex-col w-full h-full">
            <DashboardHeader />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-1100 dark:text-white transition-colors">Cartões e Dinheiro</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 transition-colors">Gerencie seus cartões, contas bancárias e dinheiro em espécie</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsNewTransactionOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#D7FF00] text-[#080B12] rounded-full hover:opacity-90 transition-all font-bold shadow-sm"
                    >
                        <ArrowRightLeft size={18} />
                        <span>Lançar Transação</span>
                    </button>

                    <button
                        onClick={() => setIsAddCardOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#080B12] dark:bg-[#D7FF00] text-white dark:text-[#080B12] rounded-full hover:bg-neutral-800 dark:hover:opacity-90 transition-all font-bold shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Novo Cartão/Conta</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2 lg:col-span-3">
                    <CreditCardsWidget />
                </div>
            </div>

            <AddAccountModal
                isOpen={isAddCardOpen}
                onClose={() => setIsAddCardOpen(false)}
            />

            <NewTransactionModal
                isOpen={isNewTransactionOpen}
                onClose={() => setIsNewTransactionOpen(false)}
            />
        </div>
    );
}
