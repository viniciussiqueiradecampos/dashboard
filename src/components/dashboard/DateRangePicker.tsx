import * as React from "react";
import { format, startOfMonth, endOfMonth, startOfYear, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import { useFinance } from "@/contexts/FinanceContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DateRangePicker() {
    const { filters, setFilters } = useFinance();

    const [range, setRange] = React.useState<DateRange | undefined>({
        from: new Date(filters.dateRange.startDate),
        to: new Date(filters.dateRange.endDate)
    });

    const handleSelect = (newRange: DateRange | undefined) => {
        setRange(newRange);
        if (newRange?.from && newRange?.to) {
            setFilters(prev => ({
                ...prev,
                dateRange: {
                    startDate: format(newRange.from!, "yyyy-MM-dd"),
                    endDate: format(newRange.to!, "yyyy-MM-dd"),
                }
            }));
        }
    };

    const shortcuts = [
        { label: "Este mês", get: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
        { label: "Mês passado", get: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
        { label: "Últimos 3 meses", get: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
        { label: "Este ano", get: () => ({ from: startOfYear(new Date()), to: new Date() }) },
    ];

    const applyShortcut = (shortcut: typeof shortcuts[0]) => {
        const sRange = shortcut.get();
        handleSelect(sRange);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="h-12 px-5 flex items-center gap-3 rounded-full border border-[#9CA3AF] dark:border-neutral-700 bg-transparent text-[#080B12] dark:text-white font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all outline-none">
                    <CalendarIcon size={18} className="text-[#080B12] dark:text-white" />
                    <span className="text-sm whitespace-nowrap">
                        {range?.from ? (
                            range.to ? (
                                <>
                                    {format(range.from, "dd MMM", { locale: ptBR })} - {format(range.to, "dd MMM, yyyy", { locale: ptBR })}
                                </>
                            ) : (
                                format(range.from, "dd MMM, yyyy", { locale: ptBR })
                            )
                        ) : (
                            "Selecionar período"
                        )}
                    </span>
                    <ChevronDown size={14} className="text-[#080B12] dark:text-white ml-1" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 flex flex-col md:flex-row bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-3xl overflow-hidden" align="end">
                {/* Shortcuts */}
                <div className="flex flex-col p-4 bg-neutral-50 dark:bg-neutral-800/50 border-r border-neutral-100 dark:border-neutral-800 gap-1">
                    <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest px-2 mb-2">Atalhos</p>
                    {shortcuts.map((s) => (
                        <button
                            key={s.label}
                            onClick={() => applyShortcut(s)}
                            className="text-left px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-colors whitespace-nowrap"
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Calendar */}
                <div className="p-4">
                    <style>{`
                .rdp { 
                    --rdp-accent-color: #D7FF00; 
                    --rdp-background-color: #F3F4F6; 
                    margin: 0; 
                }
                .dark .rdp {
                    --rdp-background-color: #1F2937;
                    color: white;
                }
                .rdp-day_selected { 
                    background-color: #080B12 !important; 
                    color: white !important; 
                    font-weight: bold; 
                    border-radius: 50%; 
                }
                .dark .rdp-day_selected {
                    background-color: #D7FF00 !important;
                    color: #080B12 !important;
                }
                .rdp-day_range_middle { 
                    background-color: #F3F4F6 !important; 
                    color: #080B12 !important; 
                    border-radius: 0; 
                }
                .dark .rdp-day_range_middle {
                    background-color: #374151 !important;
                    color: white !important;
                }
                .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { 
                    background-color: #D7FF00 !important; 
                    color: #080B12 !important; 
                }
                .dark .rdp-nav_button {
                    color: white;
                }
                .dark .rdp-head_cell {
                    color: #9CA3AF;
                }
            `}</style>
                    <DayPicker
                        mode="range"
                        selected={range}
                        onSelect={handleSelect}
                        locale={ptBR}
                        numberOfMonths={window.innerWidth > 768 ? 2 : 1}
                        pagedNavigation
                        className="font-sans"
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
