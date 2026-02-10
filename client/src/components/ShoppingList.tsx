import React, { useState, useEffect } from 'react';
import { Check, Plus, Loader2 } from 'lucide-react';
import { ShoppingItem } from '../types';
import { api } from '../api';

export const ShoppingList = () => {
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [newItemName, setNewItemName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const loadItems = async () => {
        const data = await api.getShoppingItems();
        setItems(data);
        setLoading(false);
    };

    useEffect(() => {
        loadItems();
    }, []);

    const toggleItem = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setItems(items.map(item => 
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
        // API call
        await api.toggleShoppingItem(id, !currentStatus);
    };

    const clearPurchased = async () => {
        setItems(items.filter(i => !i.checked));
        await api.clearPurchasedItems();
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newItemName.trim()) return;
        
        const newItem = {
            name: newItemName,
            quantity: 1,
            checked: false,
            category: 'Groceries'
        };

        setIsAdding(true);
        const added = await api.addShoppingItem(newItem);
        setItems([...items, added]);
        setNewItemName('');
        setIsAdding(false);
    };

    const activeItems = items.filter(i => !i.checked);
    const purchasedItems = items.filter(i => i.checked);

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

                {/* Quick Add Input */}
                <form onSubmit={handleAddItem} className="mb-4 relative">
                    <input 
                        type="text" 
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Add new item..."
                        className="w-full bg-white dark:bg-surface-dark border-none rounded-xl py-3 pl-4 pr-12 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary shadow-sm"
                    />
                    <button 
                        type="submit" 
                        disabled={isAdding}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-background-dark"
                    >
                        {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={20} />}
                    </button>
                </form>
            </header>

            <main className="flex-1 px-4 pb-32 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Active Items */}
                        {activeItems.map(item => (
                            <div 
                                key={item.id}
                                onClick={() => toggleItem(item.id, item.checked)}
                                className="group flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-2xl active:scale-[0.98] transition-all duration-200 border border-slate-100 dark:border-white/5 shadow-sm cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
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
                                onClick={() => toggleItem(item.id, item.checked)}
                                className="group flex items-center justify-between p-4 bg-transparent rounded-2xl opacity-50 cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                        <Check size={14} className="text-background-dark" strokeWidth={4} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[17px] line-through text-slate-900 dark:text-white">{item.name}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};