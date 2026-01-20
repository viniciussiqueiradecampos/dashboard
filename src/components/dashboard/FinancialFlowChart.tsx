import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
    { month: 'JAN', receitas: 8500, despesas: 6200 },
    { month: 'FEV', receitas: 11000, despesas: 7800 },
    { month: 'MAR', receitas: 12500, despesas: 9500 },
    { month: 'ABR', receitas: 10500, despesas: 11500 },
    { month: 'MAI', receitas: 14000, despesas: 10200 },
    { month: 'JUN', receitas: 13000, despesas: 12000 },
    { month: 'JUL', receitas: 16000, despesas: 11000 },
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
    }).format(value).replace('R$', 'R$ ');
};

const formatYAxis = (value: number) => {
    if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
    }
    return `R$ ${value}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-neutral-200 p-4 rounded-2xl shadow-xl outline-none">
                <p className="text-sm font-bold text-neutral-1100 mb-2">{label}</p>
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-green-700">
                        Receitas: {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-xs font-semibold text-neutral-1100">
                        Despesas: {formatCurrency(payload[1].value)}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export function FinancialFlowChart() {
    return (
        <div className="w-full bg-white border border-neutral-300 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-neutral-100 rounded-xl">
                        <TrendingUp size={24} className="text-neutral-1100" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-1100">Fluxo financeiro</h2>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#D7FF00]" />
                        <span className="text-xs font-bold text-neutral-600">Receitas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#080B12]" />
                        <span className="text-xs font-bold text-neutral-600">Despesas</span>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={mockData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D7FF00" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#D7FF00" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#080B12" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#080B12" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="4 4"
                            stroke="#E5E7EB"
                            opacity={0.5}
                        />

                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }}
                            dy={15}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }}
                            tickFormatter={formatYAxis}
                            width={60}
                        />

                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
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
                            stroke="#080B12"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorDespesas)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
