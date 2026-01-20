import { CreditCard as CardIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { CreditCard } from '@/types';
import { CardDetailsModal } from '@/components/modals/CardDetailsModal';
import { AddAccountModal } from '@/components/modals/AddAccountModal';

interface CreditCardItemProps {
    card: CreditCard;
    onClick: () => void;
}

function CreditCardItem({ card, onClick }: CreditCardItemProps) {
    const usagePercentage = Math.round((card.currentInvoice / card.limit) * 100);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    // Theme logic based on CreditCardTheme type
    const getThemeStyles = (themeName: string) => {
        switch (themeName) {
            case 'black':
                return { bg: 'bg-[#080B12]', icon: 'text-[#D7FF00]', badge: 'bg-[#D7FF00] text-[#080B12]' };
            case 'lime':
                return { bg: 'bg-[#D7FF00]', icon: 'text-[#080B12]', badge: 'bg-[#080B12] text-white' };
            default: // white
                return { bg: 'bg-white border border-neutral-200', icon: 'text-neutral-600', badge: 'bg-neutral-100 text-neutral-800' };
        }
    };

    const theme = getThemeStyles(card.theme);

    return (
        <div
            onClick={onClick}
            className="group bg-white p-5 rounded-3xl shadow-sm border border-neutral-100 flex items-center gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
        >
            {/* Left: Icon Block */}
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", theme.bg)}>
                <CardIcon size={24} className={theme.icon} />
            </div>

            {/* Center: Info */}
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-neutral-500 mb-0.5">{card.brand} {card.name}</p>
                <h4 className="text-lg font-bold text-neutral-1100 leading-tight">
                    {formatCurrency(card.currentInvoice)}
                </h4>
                <p className="text-[11px] text-neutral-400 font-medium">
                    •••• {card.last4Digits}
                </p>
            </div>

            {/* Right: Usage Badge */}
            <div className={cn("px-3 py-1.5 rounded-full text-[13px] font-bold shrink-0", theme.badge)}>
                {usagePercentage}%
            </div>
        </div>
    );
}

export function CreditCardsWidget() {
    const { creditCards } = useFinance();
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const itemsPerPage = 3;

    const totalPages = Math.ceil(creditCards.length / itemsPerPage);
    const currentCards = creditCards.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const nextPage = () => setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));

    const handleCardClick = (card: CreditCard) => {
        setSelectedCard(card);
        setIsDetailsModalOpen(true);
    };

    return (
        <>
            <div className="bg-white border border-neutral-300 rounded-[32px] p-6 flex flex-col shadow-sm min-h-[460px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-neutral-100">
                            <CardIcon size={22} className="text-neutral-1100" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-1100 tracking-tight">Cartões</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-1100 hover:bg-neutral-50 hover:scale-110 transition-all shadow-sm"
                            title="Adicionar cartão"
                        >
                            <Plus size={20} />
                        </button>
                        {totalPages > 1 && (
                            <div className="flex items-center ml-2 border border-neutral-200 rounded-full bg-white p-1 shadow-sm">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 0}
                                    className="p-1.5 text-neutral-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-[11px] font-bold text-neutral-600 px-1">
                                    {currentPage + 1}/{totalPages}
                                </span>
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages - 1}
                                    className="p-1.5 text-neutral-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cards List */}
                <div className="flex-1 space-y-4">
                    {currentCards.map((card) => (
                        <CreditCardItem key={card.id} card={card} onClick={() => handleCardClick(card)} />
                    ))}
                    {creditCards.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-neutral-200 rounded-3xl min-h-[200px]">
                            <p className="text-sm text-neutral-400 font-medium">Nenhum cartão encontrado</p>
                        </div>
                    )}
                </div>

                {/* Mobile Swipe Indicator */}
                <div className="mt-6 flex justify-center lg:hidden">
                    <div className="flex gap-1.5">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all",
                                    i === currentPage ? "w-4 bg-[#D7FF00]" : "bg-neutral-300"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <CardDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                card={selectedCard}
            />

            <AddAccountModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </>
    );
}
