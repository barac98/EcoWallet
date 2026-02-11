import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronLeft, SlidersHorizontal, ShoppingBag, DollarSign, Coffee, Clapperboard, Zap, Loader2, Music, Home, Filter, Edit2, Search } from 'lucide-react';
import { Transaction, ChartData } from '../types';
import { api } from '../api';
import { EditTransactionModal } from './EditTransactionModal';

// Icon Helper (Duplicated for now, ideally moved to util)
const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'Coffee': return <Coffee size={20} />;
        case 'ShoppingBag': return <ShoppingBag size={20} />;
        case 'Home': return <Home size={20} />;
        case 'DollarSign': return <DollarSign size={20} />;
        case 'Music': return <Music size={20} />;
        default: return <Zap size={20} />;
    }
};

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Groceries': return 'bg-orange-500/20 text-orange-500';
        case 'Food & Drinks': return 'bg-purple-500/20 text-purple-500';
        case 'Income': return 'bg-primary/20 text-primary';
        case 'Entertainment': return 'bg-blue-500/20 text-blue-500';
        default: return 'bg-slate-500/20 text-slate-400';
    }
};

export const BudgetHistory = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Edit Modal State
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Filter/Search State
    const [filterPeriod, setFilterPeriod] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
    const [searchQuery, setSearchQuery] = useState('');

    const loadData = async () => {
        try {
            const data = await api.getTransactions();
            setTransactions(data);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleTransactionClick = (t: Transaction) => {
        setSelectedTransaction(t);
        setIsEditModalOpen(true);
    };

    const processChartData = (data: Transaction[]) => {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const currentMonthIndex = new Date().getMonth();
        
        // Initialize last 6 months
        const result: ChartData[] = [];
        for(let i = 5; i >= 0; i--) {
            const idx = (currentMonthIndex - i + 12) % 12;
            result.push({ name: months[idx], income: 0, expense: 0 });
        }

        // Aggregate
        data.forEach(t => {
            const tDate = new Date(t.date);
            const monthName = months[tDate.getMonth()];
            // Only aggregate if within the last 6 months window approximately
            // For improved accuracy, we should check years, but for this demo logic:
            const item = result.find(r => r.name === monthName);
            if(item) {
                if(t.type === 'income') item.income += t.amount;
                else item.expense += t.amount;
            }
        });

        return result;
    };

    const chartData = useMemo(() => processChartData(transactions), [transactions]);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    // Group Transactions by Date
    const groupedTransactions = useMemo(() => {
        const groups: { [key: string]: Transaction[] } = {};
        
        // Filter first
        const filtered = transactions.filter(t => 
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            t.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

        filtered.forEach(t => {
            const d = new Date(t.date);
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            let key = d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
            
            if (d.toDateString() === today.toDateString()) key = 'Today';
            else if (d.toDateString() === yesterday.toDateString()) key = 'Yesterday';

            if (!groups[key]) groups[key] = [];
            groups[key].push(t);
        });
        return groups;
    }, [transactions, searchQuery]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-32 flex flex-col">
            
            {/* Header */}
            <header className="px-6 pt-6 pb-4 bg-background-light dark:bg-background-dark sticky top-0 z-10">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Analytics & History</h1>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-surface-card border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400">
                        <Filter size={20} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search transactions..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-surface-card border border-slate-200 dark:border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>

                {/* Period Switcher */}
                <div className="bg-slate-200 dark:bg-surface-card p-1 rounded-xl flex items-center">
                    {(['Weekly', 'Monthly', 'Yearly'] as const).map(p => (
                        <button 
                            key={p}
                            onClick={() => setFilterPeriod(p)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filterPeriod === p ? 'bg-white dark:bg-background-dark shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </header>

            <div className="px-6 space-y-8 overflow-y-auto">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-surface-card p-5 rounded-3xl border border-slate-100 dark:border-white/5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                            <DollarSign size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Income</span>
                        <div className="text-xl font-bold mt-1 text-slate-900 dark:text-white">${totalIncome.toLocaleString()}</div>
                    </div>
                    <div className="bg-white dark:bg-surface-card p-5 rounded-3xl border border-slate-100 dark:border-white/5">
                         <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-3">
                            <ShoppingBag size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spent</span>
                        <div className="text-xl font-bold mt-1 text-slate-900 dark:text-white">${totalExpense.toLocaleString()}</div>
                    </div>
                </div>

                {/* Chart */}
                <section className="h-56 w-full bg-white dark:bg-surface-card rounded-3xl p-4 border border-slate-100 dark:border-white/5">
                    <h3 className="text-sm font-bold mb-4 ml-2">Overview</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={chartData} barSize={12}>
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
                                dy={10}
                            />
                            <Tooltip 
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: '#1c2e22', border: 'none', borderRadius: '8px', color: '#fff' }}
                            />
                            <Bar dataKey="income" stackId="a" fill="#13ec5b" radius={[4, 4, 4, 4]} />
                            <Bar dataKey="expense" stackId="b" fill="#334155" radius={[4, 4, 4, 4]} />
                        </BarChart>
                    </ResponsiveContainer>
                </section>

                {/* Transaction List */}
                <section>
                    <h3 className="text-lg font-bold mb-4">Transactions</h3>
                    <div className="space-y-6">
                        {Object.keys(groupedTransactions).length === 0 ? (
                            <div className="text-center py-10 text-slate-500">
                                No transactions found
                            </div>
                        ) : Object.entries(groupedTransactions).map(([dateLabel, items]) => (
                            <div key={dateLabel}>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{dateLabel}</h4>
                                <div className="space-y-3">
                                    {items.map(t => (
                                        <div 
                                            key={t.id} 
                                            onClick={() => handleTransactionClick(t)}
                                            className="flex items-center p-4 rounded-2xl bg-white dark:bg-surface-card border border-slate-100 dark:border-white/5 active:scale-[0.98] transition-all cursor-pointer group"
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getCategoryColor(t.category)} group-hover:scale-110 transition-transform`}>
                                                {getIcon(t.icon)}
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.title}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-slate-500">{t.category}</span>
                                                    {t.createdBy && (
                                                        <>
                                                            <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                                                            <span className="text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded-md">{t.createdBy}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-bold ${t.type === 'income' ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Edit Modal */}
            <EditTransactionModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                transaction={selectedTransaction}
                onSaveSuccess={loadData}
            />
        </div>
    );
};