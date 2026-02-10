import React from 'react';
import { ChevronLeft, ChevronRight, Edit2, TrendingUp, ShoppingBag, Home, DollarSign, Coffee, QrCode, Sliders, Music, Zap } from 'lucide-react';
import { INITIAL_TRANSACTIONS } from '../constants';
import { Transaction } from '../types';

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
        <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColor(transaction.category)}`}>
                    {getIcon(transaction.icon)}
                </div>
                <div>
                    <p className="font-bold text-slate-900 dark:text-white">{transaction.title}</p>
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
    return (
        <div className="px-6 pt-4 space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm dark:text-white">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Timeline</span>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold dark:text-white">October 2023</span>
                    </div>
                </div>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm dark:text-white">
                    <ChevronRight size={20} />
                </button>
            </header>

            {/* Income Card */}
            <section className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Monthly Income</h2>
                    <button className="text-primary hover:bg-primary/10 p-1 rounded-full transition-colors">
                        <Edit2 size={16} />
                    </button>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">$5,200</span>
                    <span className="text-slate-400 font-medium">.00</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 w-fit px-3 py-1 rounded-full">
                    <TrendingUp size={14} />
                    <span>4% from last month</span>
                </div>
            </section>

            {/* Spending Progress */}
            <section className="bg-slate-900 dark:bg-black p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden text-white">
                <div className="relative z-10">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium mb-1">Spent vs. Remaining</h3>
                            <p className="text-2xl font-bold tracking-tight text-primary">$1,200 <span className="text-slate-500 font-normal">/ $4,000</span></p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-slate-400 uppercase">30% Used</span>
                        </div>
                    </div>
                    <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(19,236,91,0.4)]" style={{ width: '30%' }}></div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-xs text-slate-400">Spent: $1,200</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                            <span className="text-xs text-slate-400">Left: $2,800</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions (Optional, matches image 2 style) */}
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
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                    <button className="text-sm font-semibold text-primary">See All</button>
                </div>
                <div className="space-y-3">
                    {INITIAL_TRANSACTIONS.map(t => (
                        <TransactionItem key={t.id} transaction={t} />
                    ))}
                </div>
            </section>
        </div>
    );
};