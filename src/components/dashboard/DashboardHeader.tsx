import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { MemberFilter } from './MemberFilter';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRangePicker } from './DateRangePicker';

export function DashboardHeader() {
    const { filters, setFilters } = useFinance();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, searchText: e.target.value }));
    };

    const handleTypeChange = (type: 'all' | 'income' | 'expense') => {
        setFilters(prev => ({ ...prev, transactionType: type }));
    };

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full mb-8">
            <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={filters.searchText}
                        onChange={handleSearchChange}
                        className="w-full h-12 pl-12 pr-4 bg-white/50 backdrop-blur-sm border border-neutral-200 rounded-full text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-black transition-all outline-none"
                    />
                </div>

                {/* Filter Trigger */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="h-12 w-12 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors shrink-0">
                            <SlidersHorizontal size={20} />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2" align="start">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-neutral-400 px-3 py-2 uppercase tracking-wider">Tipo de Transação</p>
                            {(['all', 'income', 'expense'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleTypeChange(type)}
                                    className={cn(
                                        "w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                        filters.transactionType === type
                                            ? "bg-neutral-1100 text-white"
                                            : "text-neutral-600 hover:bg-neutral-50"
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
                <button className="h-12 px-8 flex items-center justify-center gap-2 bg-neutral-1100 text-white rounded-full font-bold hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap">
                    <Plus size={20} />
                    Nova transação
                </button>
            </div>
        </div>
    );
}
