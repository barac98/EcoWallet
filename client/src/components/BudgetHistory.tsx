import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronLeft, SlidersHorizontal, ShoppingBag, DollarSign, Coffee, Clapperboard, Zap } from 'lucide-react';
import { api } from '../api';
import { Transaction, ChartData } from '../types';

export const BudgetHistory = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await api.getTransactions();
            setTransactions(data);
            processChartData(data);
        };
        load();
    }, []);

    const processChartData = (data: Transaction[]) => {
        // Simple aggregation by month for demo purposes
        // In a real app, this would be more robust date handling
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const currentMonthIndex = new Date().getMonth();
        
        // Initialize last 6 months
        const result: ChartData[] = [];
        for(let i = 6; i >= 0; i--) {
            const idx = (currentMonthIndex - i + 12) % 12;
            result.push({ name: months[idx], income: 0, expense: 0 });
        }

        // Aggregate
        data.forEach(t => {
            const tDate = new Date(t.date);
            const monthName = months[tDate.getMonth()];
            const item = result.find(r => r.name === monthName);
            if(item) {
                if(t.type === 'income') item.income += t.amount;
                else item.expense += t.amount;
            }
        });

        setChartData(result);
    };

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white px-6 pt-4 pb-32">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-xl font-semibold">Budget History</h1>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                    <SlidersHorizontal size={20} />
                </button>
            </header>

            {/* Period Switcher */}
            <div className="bg-slate-200 dark:bg-white/5 p-1 rounded-full flex items-center mb-8">
                <button className="flex-1 py-2 text-sm font-medium rounded-full text-slate-500">Weekly</button>
                <button className="flex-1 py-2 text-sm font-medium rounded-full bg-white dark:bg-surface-dark shadow-sm text-slate-900 dark:text-white">Monthly</button>
                <button className="flex-1 py-2 text-sm font-medium rounded-full text-slate-500">Yearly</button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white dark:bg-white/5 p-5 rounded-2xl">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Income</span>
                    <div className="text-2xl font-bold mt-1 text-primary">${totalIncome.toLocaleString()}</div>
                </div>
                <div className="bg-white dark:bg-white/5 p-5 rounded-2xl">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Spent</span>
                    <div className="text-2xl font-bold mt-1">${totalExpense.toLocaleString()}</div>
                </div>
            </div>

            {/* Chart */}
            <section className="mb-10 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={12}>
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
                            dy={10}
                        />
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                return (
                                    <div className="bg-surface-dark text-white text-xs px-2 py-1 rounded-lg">
                                    ${payload[0].value}
                                    </div>
                                );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="income" stackId="a" fill="#13ec5b" radius={[10, 10, 10, 10]} />
                        <Bar dataKey="expense" stackId="b" fill="#334155" radius={[10, 10, 10, 10]}>
                            {
                                chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#13ec5b' : '#334155'} />
                                ))
                            }
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </section>

             {/* Recent Activity List */}
             <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">Recent Activity</h2>
                    <button className="text-primary text-sm font-semibold">View All</button>
                </div>
                <div className="space-y-4">
                    {transactions.slice(0, 5).map((t) => (
                        <div key={t.id} className="flex items-center p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-white">
                                {t.icon === 'ShoppingBag' ? <ShoppingBag size={20} /> :
                                 t.icon === 'DollarSign' ? <DollarSign size={20} /> :
                                 t.icon === 'Coffee' ? <Coffee size={20} /> :
                                 t.icon === 'Music' ? <Clapperboard size={20} /> : <Zap size={20} />}
                            </div>
                            <div className="ml-4 flex-1">
                                <h4 className="font-semibold text-slate-900 dark:text-white">{t.title}</h4>
                                <p className="text-xs text-slate-500">{new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                            <div className="text-right">
                                <div className={`font-bold ${t.type === 'income' ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};