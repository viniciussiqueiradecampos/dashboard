import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface FiltersMobileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FiltersMobileModal({ isOpen, onClose }: FiltersMobileModalProps) {
    const { filters, setFilters, familyMembers } = useFinance();

    // Local temporary state
    const [tempType, setTempType] = useState(filters.transactionType);
    const [tempMember, setTempMember] = useState(filters.selectedMember);
    const [tempDateRange, setTempDateRange] = useState(filters.dateRange);

    // Sync with global filters when modal opens
    useEffect(() => {
        if (isOpen) {
            setTempType(filters.transactionType);
            setTempMember(filters.selectedMember);
            setTempDateRange(filters.dateRange);
        }
    }, [isOpen, filters]);

    const handleApply = () => {
        setFilters({
            ...filters,
            transactionType: tempType,
            selectedMember: tempMember,
            dateRange: tempDateRange,
        });
        onClose();
    };

    const handleCancel = () => {
        // Reset to current filters
        setTempType(filters.transactionType);
        setTempMember(filters.selectedMember);
        setTempDateRange(filters.dateRange);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleCancel}
        >
            <div
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 shrink-0">
                    <h2 className="text-2xl font-bold text-neutral-1100">Filtros</h2>
                    <button
                        onClick={handleCancel}
                        className="w-12 h-12 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors active:scale-95"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Transaction Type */}
                    <div>
                        <label className="block text-base font-bold text-neutral-1100 mb-3">
                            Tipo de Transação
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['all', 'income', 'expense'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setTempType(type)}
                                    className={cn(
                                        "h-12 rounded-xl font-medium transition-all active:scale-95",
                                        tempType === type
                                            ? 'bg-neutral-1100 text-white'
                                            : 'bg-white border-2 border-neutral-300 text-neutral-600'
                                    )}
                                >
                                    {type === 'all' ? 'Todos' : type === 'income' ? 'Receitas' : 'Despesas'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Family Member */}
                    <div>
                        <label className="block text-base font-bold text-neutral-1100 mb-3">
                            Membro da Família
                        </label>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setTempMember(null)}
                                className={cn(
                                    "h-12 px-6 rounded-full font-medium transition-all active:scale-95",
                                    tempMember === null
                                        ? 'bg-neutral-1100 text-white'
                                        : 'bg-white border-2 border-neutral-300 text-neutral-600'
                                )}
                            >
                                Todos
                            </button>
                            {familyMembers.map((member) => (
                                <button
                                    key={member.id}
                                    onClick={() => setTempMember(member.id)}
                                    className={cn(
                                        "h-12 px-4 rounded-full font-medium transition-all flex items-center gap-2 active:scale-95",
                                        tempMember === member.id
                                            ? 'bg-neutral-1100 text-white'
                                            : 'bg-white border-2 border-neutral-300 text-neutral-600'
                                    )}
                                >
                                    <img
                                        src={member.avatarUrl}
                                        alt={member.name}
                                        className={cn(
                                            "w-8 h-8 rounded-full object-cover",
                                            tempMember === member.id && 'ring-2 ring-white'
                                        )}
                                    />
                                    <span>{member.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Period - Quick Presets */}
                    <div>
                        <label className="block text-base font-bold text-neutral-1100 mb-3">
                            Período
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setTempDateRange({
                                    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
                                    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
                                })}
                                className="h-12 rounded-xl border-2 border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors active:scale-95"
                            >
                                Este Mês
                            </button>
                            <button
                                onClick={() => {
                                    const lastMonth = new Date();
                                    lastMonth.setMonth(lastMonth.getMonth() - 1);
                                    setTempDateRange({
                                        startDate: format(startOfMonth(lastMonth), 'yyyy-MM-dd'),
                                        endDate: format(endOfMonth(lastMonth), 'yyyy-MM-dd'),
                                    });
                                }}
                                className="h-12 rounded-xl border-2 border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors active:scale-95"
                            >
                                Mês Passado
                            </button>
                        </div>

                        {/* Custom Date Range */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-neutral-500 font-medium mb-2">Data Inicial</label>
                                <input
                                    type="date"
                                    value={tempDateRange.startDate}
                                    onChange={(e) => setTempDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="w-full h-12 px-4 bg-white border-2 border-neutral-300 rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-neutral-500 font-medium mb-2">Data Final</label>
                                <input
                                    type="date"
                                    value={tempDateRange.endDate}
                                    onChange={(e) => setTempDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="w-full h-12 px-4 bg-white border-2 border-neutral-300 rounded-xl text-neutral-1100 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Fixed */}
                <div className="p-6 border-t border-neutral-200 bg-white shrink-0">
                    <button
                        onClick={handleApply}
                        className="w-full h-14 bg-neutral-1100 text-white rounded-full font-bold text-lg hover:bg-neutral-900 active:scale-[0.98] transition-all"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
}
