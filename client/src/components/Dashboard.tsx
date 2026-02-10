import { useEffect, useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Edit2, TrendingUp, ShoppingBag, Home, DollarSign, Coffee, QrCode, Sliders, Music, Zap, RefreshCw } from 'lucide-react';
import { Transaction } from '../types';
import { api } from '../api';
import { useUser } from '../UserContext';

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
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

    const getColor = (category: string) => {
        if (category === 'Groceries') return 'bg-orange-100 dark:bg-orange-900/30 text-orange-500';
        if (category === 'Income') return 'bg-primary/20 dark:bg-primary/10 text-primary';
        if (category === 'Food & Drinks') return 'bg-purple-100 dark:bg-purple-900/30 text-purple-500';
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-500';
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden">
             {/* User Indicator */}
             {transaction.createdBy && (
                <div className="absolute top-0 right-0 bg-slate-200 dark:bg-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg text-slate-600 dark:text-slate-300">
                    {transaction.createdBy}
                </div>
            )}
            
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColor(transaction.category)}`}>
                    {getIcon(transaction.icon)}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900 dark:text-white">{transaction.title}</p>
                    </div>
                    <p className="text-xs text-slate-400">{new Date(transaction.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </div>
            <span className={`font-bold ${transaction.type === 'income' ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </span>
        </div>
    );
};

export const Dashboard = () => {
    const { user, logout } = useUser();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const loadData = async () => {
        setLoading(true);
        const data = await api.getTransactions();
        setTransactions(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const d = new Date(prev);
            d.setDate(1); // Set to 1st to avoid month overflow issues (e.g. Oct 31 -> Sept)
            d.setMonth(d.getMonth() + offset);
            return d;
        });
    };

    // Filter transactions by selected month
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === currentDate.getMonth() &&
                   tDate.getFullYear() === currentDate.getFullYear();
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, currentDate]);

    // Derived State for UI
    const totalIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="px-6 pt-4 space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between">
                {/* User Badge - Click to Logout */}
                <button 
                    onClick={() => {
                        if(confirm(`Switch user from ${user}?`)) logout();
                    }}
                    className="flex items-center gap-2 bg-white dark:bg-surface-dark pl-1 pr-3 py-1 rounded-full shadow-sm border border-slate-100 dark:border-white/5 active:bg-slate-50 dark:active:bg-white/10"
                >
                    <div className="w-8 h-8 rounded-full bg-primary text-background-dark font-bold flex items-center justify-center text-sm">
                        {user ? user[0].toUpperCase() : '?'}
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{user}</span>
                </button>

                {/* Month Navigator */}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Timeline</span>
                    <div className="flex items-center gap-1 bg-slate-200 dark:bg-white/5 rounded-full p-1 pl-2 pr-2">
                        <button 
                            onClick={() => changeMonth(-1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95"
                        >
                            <ChevronLeft size={16} className="text-slate-600 dark:text-slate-300" />
                        </button>
                        <span className="text-sm font-bold dark:text-white min-w-[100px] text-center">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button 
                            onClick={() => changeMonth(1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95"
                        >
                            <ChevronRight size={16} className="text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>
                </div>

                {/* Refresh Button */}
                <button onClick={loadData} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm dark:text-white active:rotate-180 transition-transform">
                    {loading ? <RefreshCw size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                </button>
            </header>

            {/* Income Card */}
            <section className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Income</h2>
                    <button className="text-primary hover:bg-primary/10 p-1 rounded-full transition-colors">
                        <Edit2 size={16} />
                    </button>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">${totalIncome.toLocaleString()}</span>
                    <span className="text-slate-400 font-medium">.00</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 w-fit px-3 py-1 rounded-full">
                    <TrendingUp size={14} />
                    <span>Calculated for {currentDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                </div>
            </section>

            {/* Spending Progress */}
            <section className="bg-slate-900 dark:bg-black p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden text-white">
                <div className="relative z-10">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium mb-1">Spent vs. Income</h3>
                            <p className="text-2xl font-bold tracking-tight text-primary">${totalExpense.toLocaleString()} <span className="text-slate-500 font-normal">/ ${totalIncome.toLocaleString()}</span></p>
                        </div>
                    </div>
                    <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(19,236,91,0.4)]" 
                            style={{ width: `${Math.min((totalExpense / (totalIncome || 1)) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <button className="bg-white dark:bg-surface-dark p-4 rounded-xl flex items-center justify-center gap-2 shadow-sm">
                    <QrCode className="text-slate-900 dark:text-white" size={20} />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Scan</span>
                </button>
                <button className="bg-white dark:bg-surface-dark p-4 rounded-xl flex items-center justify-center gap-2 shadow-sm">
                    <Sliders className="text-slate-900 dark:text-white" size={20} />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Limits</span>
                </button>
            </div>

            {/* Recent Activity */}
            <section className="pb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity ({currentDate.toLocaleDateString('en-US', { month: 'short' })})</h3>
                    <button className="text-sm font-semibold text-primary">See All</button>
                </div>
                <div className="space-y-3">
                    {loading ? (
                        <p className="text-slate-400 text-center text-sm py-4">Loading transactions...</p>
                    ) : filteredTransactions.length === 0 ? (
                        <p className="text-slate-400 text-center text-sm py-4">No transactions for {currentDate.toLocaleDateString('en-US', { month: 'long' })}.</p>
                    ) : (
                        filteredTransactions.map(t => (
                            <TransactionItem key={t.id} transaction={t} />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};