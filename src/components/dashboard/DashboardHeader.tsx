import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { MemberFilter } from './MemberFilter';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRangePicker } from './DateRangePicker';
import { NewTransactionModal } from '@/components/modals/NewTransactionModal';
import { FiltersMobileModal } from '@/components/modals/FiltersMobileModal';
import { useState } from 'react';

export function DashboardHeader() {
    const { filters, setFilters } = useFinance();
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isFiltersMobileOpen, setIsFiltersMobileOpen] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, searchText: e.target.value }));
    };

    const handleTypeChange = (type: 'all' | 'income' | 'expense') => {
        setFilters(prev => ({ ...prev, transactionType: type }));
    };

    return (
        <>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full mb-8">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#080B12]" size={18} />
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            value={filters.searchText}
                            onChange={handleSearchChange}
                            className="w-full h-12 pl-12 pr-4 bg-transparent border border-[#9CA3AF] rounded-full text-[#080B12] placeholder:text-neutral-500 focus:ring-2 focus:ring-black transition-all outline-none"
                        />
                    </div>

                    {/* Filter Trigger - Desktop: Popover, Mobile: Modal */}
                    {/* Mobile Filter Button */}
                    <button
                        onClick={() => setIsFiltersMobileOpen(true)}
                        className="lg:hidden h-12 w-12 flex items-center justify-center rounded-full bg-transparent border border-[#9CA3AF] text-[#080B12] hover:bg-neutral-100 transition-colors shrink-0"
                    >
                        <SlidersHorizontal size={20} />
                    </button>

                    {/* Desktop Filter Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="hidden lg:flex h-12 w-12 items-center justify-center rounded-full bg-transparent border border-[#9CA3AF] text-[#080B12] hover:bg-neutral-100 transition-colors shrink-0">
                                <SlidersHorizontal size={20} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2 bg-[#080B12] border-neutral-800" align="start">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-neutral-400 px-3 py-2 uppercase tracking-wider">Tipo de Transação</p>
                                {(['all', 'income', 'expense'] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleTypeChange(type)}
                                        className={cn(
                                            "w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:text-white",
                                            filters.transactionType === type
                                                ? "bg-[#D7FF00] text-[#080B12]"
                                                : "text-neutral-300 hover:bg-neutral-800"
                                        )}
                                    >
                                        {type === 'all' ? 'Todos' : type === 'income' ? 'Receitas' : 'Despesas'}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Date Range Picker */}
                    <DateRangePicker />

                    {/* Member Filter */}
                    <MemberFilter />

                    {/* New Transaction Button */}
                    <button
                        onClick={() => setIsTransactionModalOpen(true)}
                        className="h-12 px-8 flex items-center justify-center gap-2 bg-neutral-1100 text-white rounded-full font-bold hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
                    >
                        <Plus size={20} />
                        Nova transação
                    </button>
                </div>
            </div>

            <NewTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
            />

            <FiltersMobileModal
                isOpen={isFiltersMobileOpen}
                onClose={() => setIsFiltersMobileOpen(false)}
            />
        </>
    );
}
