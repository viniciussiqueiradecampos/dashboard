import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '@/contexts/FinanceContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useMemo } from 'react';
import { parseISO, format as formatDateFns } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/cn';

const CustomTooltip = ({ active, payload, label, formatCurrency }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl shadow-xl outline-none">
                <p className="text-sm font-bold text-neutral-1100 dark:text-white mb-2">{label}</p>
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-500">
                        Receitas: {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-xs font-semibold text-neutral-1100 dark:text-white">
                        Despesas: {formatCurrency(payload[1].value)}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export function FinancialFlowChart() {
    const { transactions } = useFinance();
    const { theme } = useTheme();
    const { formatCurrency, currency } = useSettings();

    const chartData = useMemo(() => {
        if (!transactions.length) return [];

        // Group by month
        const grouped = transactions.reduce((acc, t) => {
            const date = parseISO(t.date);
            const locale = currency === 'BRL' ? ptBR : enUS;
            const monthName = formatDateFns(date, 'MMM', { locale }).toUpperCase();

            if (!acc[monthName]) {
                acc[monthName] = { month: monthName, receitas: 0, despesas: 0, timestamp: date.getTime() };
            }

            if (t.type === 'income') {
                acc[monthName].receitas += t.amount;
            } else {
                acc[monthName].despesas += t.amount;
            }

            return acc;
        }, {} as Record<string, { month: string; receitas: number; despesas: number; timestamp: number }>);

        // Sort by date and format
        return Object.values(grouped)
            .sort((a, b) => a.timestamp - b.timestamp)
            .map(({ month, receitas, despesas }) => ({ month, receitas, despesas }));
    }, [transactions, currency]);

    const expenseColor = theme === 'dark' ? '#FFFFFF' : '#080B12';

    const formatYAxis = (value: number) => {
        if (value >= 1000) {
            // Simplesmente abrevia, o símbolo já é conhecido pelo contexto
            return `${(value / 1000).toFixed(0)}k`;
        }
        return `${value}`;
    };

    return (
        <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-[32px] p-8 shadow-sm h-full flex flex-col transition-colors duration-300">
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl transition-colors">
                        <TrendingUp size={24} className="text-neutral-1100 dark:text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-1100 dark:text-white">Fluxo financeiro</h2>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#D7FF00]" />
                        <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Receitas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2.5 h-2.5 rounded-full", theme === 'dark' ? "bg-white" : "bg-[#080B12]")} />
                        <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Despesas</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[240px] w-full flex items-center justify-center">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                        >
                            <defs>
                                <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D7FF00" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#D7FF00" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={expenseColor} stopOpacity={0.1} />
                                    <stop offset="95%" stopColor={expenseColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="4 4"
                                stroke={theme === 'dark' ? '#334155' : '#E5E7EB'}
                                opacity={0.5}
                            />

                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B', fontSize: 12, fontWeight: 700 }}
                                dy={15}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B', fontSize: 12, fontWeight: 700 }}
                                tickFormatter={formatYAxis}
                                width={40}
                            />

                            <Tooltip
                                content={<CustomTooltip formatCurrency={formatCurrency} />}
                                cursor={{ stroke: theme === 'dark' ? '#334155' : '#E5E7EB', strokeWidth: 1 }}
                            />

                            <Area
                                type="monotone"
                                dataKey="receitas"
                                stroke="#D7FF00"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorReceitas)"
                                animationDuration={1500}
                            />

                            <Area
                                type="monotone"
                                dataKey="despesas"
                                stroke={expenseColor}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorDespesas)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center">
                        <p className="text-neutral-400 font-medium">Nenhum dado por enquanto</p>
                        <p className="text-xs text-neutral-300 mt-1">Adicione lançamentos para visualizar o gráfico</p>
                    </div>
                )}
            </div>
        </div>
    );
}
