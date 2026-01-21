import { CreditCard as CardIcon, Plus, ChevronRight, Banknote } from 'lucide-react';
import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/utils/cn';
import { CreditCard, BankAccount } from '@/types';
import { CardDetailsModal } from '@/components/modals/CardDetailsModal';
import { AddAccountModal } from '@/components/modals/AddAccountModal';
import { EditAccountModal } from '@/components/modals/EditAccountModal';

interface CreditCardItemProps {
    card: CreditCard;
    onClick: () => void;
}

function CreditCardItem({ card, onClick }: CreditCardItemProps) {
    const { formatCurrency, t } = useSettings();
    const usagePercentage = card.limit > 0 ? Math.round((card.currentInvoice / card.limit) * 100) : 0;
    const availableLimit = card.limit - card.currentInvoice;

    // Define colors based on usage percentage
    const getProgressColor = () => {
        if (usagePercentage >= 90) return 'bg-red-500';
        if (usagePercentage >= 70) return 'bg-orange-500';
        return 'bg-green-500';
    };

    // Bank logo colors
    const getBankStyle = (brand: string) => {
        const brandLower = brand.toLowerCase();
        if (brandLower.includes('nubank')) return { bg: 'bg-purple-600', text: 'text-white' };
        if (brandLower.includes('inter')) return { bg: 'bg-orange-500', text: 'text-white' };
        if (brandLower.includes('picpay')) return { bg: 'bg-green-500', text: 'text-white' };
        if (brandLower.includes('itau') || brandLower.includes('itaú')) return { bg: 'bg-orange-600', text: 'text-white' };
        if (brandLower.includes('bradesco')) return { bg: 'bg-red-600', text: 'text-white' };
        if (brandLower.includes('santander')) return { bg: 'bg-red-500', text: 'text-white' };
        if (brandLower.includes('caixa')) return { bg: 'bg-blue-600', text: 'text-white' };
        if (brandLower.includes('bb') || brandLower.includes('brasil')) return { bg: 'bg-yellow-500', text: 'text-black' };
        if (brandLower.includes('c6')) return { bg: 'bg-black', text: 'text-white' };
        if (brandLower.includes('xp')) return { bg: 'bg-black', text: 'text-white' };
        return { bg: 'bg-neutral-800', text: 'text-white' };
    };

    const bankStyle = getBankStyle(card.brand);

    return (
        <div
            onClick={onClick}
            className="py-5 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors px-2 -mx-2 rounded-lg"
        >
            {/* Header: Bank name and last digits */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {card.imageUrl ? (
                        <img src={card.imageUrl} alt={card.brand} className="w-6 h-6 rounded object-cover" />
                    ) : (
                        <div className={cn("w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold", bankStyle.bg, bankStyle.text)}>
                            {card.brand.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">{card.brand}</span>
                </div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">**** {card.last4Digits}</span>
            </div>

            {/* Amount used */}
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                {formatCurrency(card.currentInvoice)}
            </h3>

            {/* Due date */}
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                {t('Vencimento')} {card.dueDay}
            </p>

            {/* Available limit */}
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-green-600 dark:text-green-500">
                    {t('Disponível')}: {formatCurrency(availableLimit)}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    {usagePercentage}%
                </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-2">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", getProgressColor())}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
            </div>

            {/* Total limit */}
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
                {t('Limite Total')}: {formatCurrency(card.limit)}
            </p>
        </div>
    );
}

interface AccountItemProps {
    account: BankAccount;
    isCash?: boolean;
    onClick: () => void;
}

function AccountItem({ account, isCash, onClick }: AccountItemProps) {
    const { formatCurrency, t } = useSettings();

    return (
        <div
            onClick={onClick}
            className="py-5 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors px-2 -mx-2 rounded-lg"
        >
            {/* Header: Bank name */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {account.imageUrl ? (
                        <img src={account.imageUrl} alt={account.bankName} className="w-6 h-6 rounded object-cover" />
                    ) : (
                        <div className={cn(
                            "w-6 h-6 rounded flex items-center justify-center",
                            isCash ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                        )}>
                            {isCash ? <Banknote size={14} /> : <span className="text-[10px] font-bold">{account.bankName.substring(0, 2).toUpperCase()}</span>}
                        </div>
                    )}
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {isCash ? t('Dinheiro (Espécie)') : account.bankName}
                    </span>
                </div>
            </div>

            {/* Account name */}
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                {account.name}
            </h3>

            {/* Balance */}
            <p className={cn(
                "text-xl font-bold",
                account.balance >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
            )}>
                {formatCurrency(account.balance)}
            </p>
        </div>
    );
}

export function CreditCardsWidget() {
    const { creditCards, bankAccounts } = useFinance();
    const { t } = useSettings();
    const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleCardClick = (card: CreditCard) => {
        setSelectedCard(card);
        setIsDetailsModalOpen(true);
    };

    const handleAccountClick = (account: BankAccount) => {
        setSelectedAccount(account);
        setIsEditAccountOpen(true);
    };

    return (
        <>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px] p-6 shadow-sm transition-colors duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl transition-colors">
                            <CardIcon size={20} className="text-neutral-900 dark:text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">{t('Cards & contas')}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                            title={t('Adicionar conta ou cartão')}
                        >
                            <Plus size={20} />
                        </button>
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                            title="Ver todos"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Cards List */}
                <div className="space-y-0">
                    {creditCards.map((card) => (
                        <CreditCardItem
                            key={card.id}
                            card={card}
                            onClick={() => handleCardClick(card)}
                        />
                    ))}

                    {bankAccounts.map((account) => (
                        <AccountItem
                            key={account.id}
                            account={account}
                            isCash={account.name.toLowerCase() === 'dinheiro' || account.bankName.toLowerCase() === 'dinheiro'}
                            onClick={() => handleAccountClick(account)}
                        />
                    ))}

                    {creditCards.length === 0 && bankAccounts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                            <CardIcon size={32} className="text-neutral-300 dark:text-neutral-700 mb-3" />
                            <p className="text-sm text-neutral-400 font-medium">{t('Nenhum cartão ou conta cadastrado')}</p>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="mt-4 px-4 py-2 bg-neutral-900 dark:bg-[#D7FF00] text-white dark:text-black rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                {t('Adicionar primeiro cartão')}
                            </button>
                        </div>
                    )}
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

            <EditAccountModal
                isOpen={isEditAccountOpen}
                onClose={() => setIsEditAccountOpen(false)}
                account={selectedAccount}
            />
        </>
    );
}
