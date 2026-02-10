import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { INITIAL_SHOPPING_ITEMS } from '../constants';
import { ShoppingItem } from '../types';

export const ShoppingList = () => {
    const [items, setItems] = useState<ShoppingItem[]>(INITIAL_SHOPPING_ITEMS);

    const toggleItem = (id: string) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const activeItems = items.filter(i => !i.checked);
    const purchasedItems = items.filter(i => i.checked);

    const clearPurchased = () => {
        setItems(items.filter(i => !i.checked));
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="flex justify-between items-end mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Shopping</h1>
                    <button 
                        onClick={clearPurchased}
                        className="text-primary font-semibold text-sm mb-1 px-3 py-1 rounded-full active:bg-primary/10 transition-colors"
                    >
                        Clear Purchased
                    </button>
                </div>
                
                {/* Search & Categories */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                     <button className="px-5 py-2.5 rounded-full bg-primary text-background-dark text-sm font-bold shadow-lg shadow-primary/20 whitespace-nowrap">
                        All Items
                    </button>
                    <button className="px-5 py-2.5 rounded-full bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 text-sm font-medium whitespace-nowrap border border-slate-100 dark:border-white/5">
                        Groceries
                    </button>
                    <button className="px-5 py-2.5 rounded-full bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 text-sm font-medium whitespace-nowrap border border-slate-100 dark:border-white/5">
                        Electronics
                    </button>
                </div>
            </header>

            <main className="flex-1 px-4 pb-32 overflow-y-auto">
                {/* Date Label */}
                <div className="px-2 mt-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today</span>
                </div>

                <div className="space-y-3">
                    {/* Active Items */}
                    {activeItems.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className="group flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-2xl active:scale-[0.98] transition-all duration-200 border border-slate-100 dark:border-white/5 shadow-sm cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                                    {/* Empty circle */}
                                </div>
                                <div>
                                    <p className="font-semibold text-[17px]">{item.name}</p>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">{item.category}</p>
                                </div>
                            </div>
                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                                x{item.quantity}
                            </div>
                        </div>
                    ))}

                    {/* Separator */}
                    {purchasedItems.length > 0 && (
                        <div className="px-2 mt-8 mb-2 flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Purchased</span>
                            <div className="flex-1 h-[1px] bg-slate-200 dark:bg-white/10"></div>
                        </div>
                    )}

                    {/* Purchased Items */}
                    {purchasedItems.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className="group flex items-center justify-between p-4 bg-transparent rounded-2xl opacity-50 cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                    <Check size={14} className="text-background-dark" strokeWidth={4} />
                                </div>
                                <div>
                                    <p className="font-medium text-[17px] line-through text-slate-900 dark:text-white">{item.name}</p>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">{item.category}</p>
                                </div>
                            </div>
                            <div className="bg-slate-200 dark:bg-white/10 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
                                x{item.quantity}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Finance Tip */}
                <div className="mt-8 p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                        <span className="font-bold text-lg">!</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-primary uppercase tracking-tighter">Finance Tip</p>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Buy in bulk for x2 items to save 15% this month.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};