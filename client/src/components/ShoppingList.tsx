import React, { useState, useEffect } from 'react';
import { Check, Plus, Loader2, Minus, ShoppingBag, X, Trash2 } from 'lucide-react';
import { ShoppingItem } from '../types';
import { api } from '../api';
import { useUser } from '../UserContext';

export const ShoppingList = () => {
    const { user } = useUser();
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Add Item Form State
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState<number>(1);
    const [isAdding, setIsAdding] = useState(false);
    
    // Edit Mode State (for Quantity)
    const [editingQtyId, setEditingQtyId] = useState<string | null>(null);

    // Complete Trip State
    const [isCompletingTrip, setIsCompletingTrip] = useState(false);
    const [tripTotal, setTripTotal] = useState('');
    const [isSavingTrip, setIsSavingTrip] = useState(false);

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
            item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
        ));
        // API call
        await api.updateShoppingItem(id, { isPurchased: !currentStatus });
    };

    const updateQuantity = async (id: string, newQty: number) => {
        if (newQty < 1) return; // Prevent going below 1
        
        // Optimistic
        setItems(items.map(item => 
            item.id === id ? { ...item, quantity: newQty } : item
        ));
        // API
        await api.updateShoppingItem(id, { quantity: newQty });
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newItemName.trim()) return;
        
        const newItem: Omit<ShoppingItem, 'id'> = {
            name: newItemName,
            quantity: newItemQuantity,
            isPurchased: false,
            category: 'Groceries',
            addedBy: user || 'Family'
        };

        setIsAdding(true);
        const added = await api.addShoppingItem(newItem);
        setItems([...items, added]);
        
        // Reset form
        setNewItemName('');
        setNewItemQuantity(1);
        setIsAdding(false);
    };

    const handleCompleteTrip = async () => {
        if (!tripTotal || parseFloat(tripTotal) <= 0) return;
        setIsSavingTrip(true);

        const purchasedItems = items.filter(i => i.isPurchased);
        
        // Create summary string for the transaction title or just count
        const summary = `Shopping: ${purchasedItems.length} items`;

        // 1. Add Transaction
        await api.addTransaction({
            title: summary,
            amount: parseFloat(tripTotal),
            category: 'Groceries',
            date: new Date().toISOString(),
            type: 'expense',
            icon: 'ShoppingBag'
        });

        // 2. Clear Items from DB
        await api.clearPurchasedItems();
        
        // 3. Update Local State
        setItems(items.filter(i => !i.isPurchased));
        
        setIsSavingTrip(false);
        setIsCompletingTrip(false);
        setTripTotal('');
    };

    const activeItems = items.filter(i => !i.isPurchased);
    const purchasedItems = items.filter(i => i.isPurchased);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col relative">
            {/* Header */}
            <header className="px-6 py-4 sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-transparent dark:border-white/5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold tracking-tight">Shopping List</h1>
                    {purchasedItems.length > 0 && (
                        <button 
                            onClick={() => setIsCompletingTrip(true)}
                            className="bg-primary text-background-dark text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-transform flex items-center gap-2"
                        >
                            <Check size={14} strokeWidth={3} />
                            Complete Trip
                        </button>
                    )}
                </div>

                {/* Quick Add Form */}
                <form onSubmit={handleAddItem} className="flex gap-2 items-stretch">
                    <div className="flex-1 bg-white dark:bg-surface-dark rounded-xl flex items-center p-1 border border-slate-200 dark:border-white/10 focus-within:ring-2 focus-within:ring-primary transition-all shadow-sm">
                        <input 
                            type="text" 
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Add item..."
                            className="flex-1 bg-transparent border-none px-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 min-w-0"
                        />
                        {/* Inline Quantity Stepper for New Item */}
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 rounded-lg p-1 mr-1">
                            <button 
                                type="button"
                                onClick={() => setNewItemQuantity(Math.max(1, newItemQuantity - 1))}
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 shadow-sm active:scale-90 transition-transform hover:bg-slate-200 dark:hover:bg-white/20"
                            >
                                <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{newItemQuantity}</span>
                            <button 
                                type="button"
                                onClick={() => setNewItemQuantity(newItemQuantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 shadow-sm active:scale-90 transition-transform hover:bg-slate-200 dark:hover:bg-white/20"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isAdding || !newItemName.trim()}
                        className="w-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-background-dark disabled:opacity-50 transition-colors"
                    >
                        {isAdding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={24} />}
                    </button>
                </form>
            </header>

            <main className="flex-1 px-4 pb-32 overflow-y-auto pt-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Active Items */}
                        {activeItems.length === 0 && purchasedItems.length === 0 && (
                            <div className="text-center py-10 opacity-50">
                                <ShoppingBag size={48} className="mx-auto mb-2 text-slate-400" />
                                <p>Your list is empty</p>
                            </div>
                        )}

                        {activeItems.map(item => (
                            <div 
                                key={item.id}
                                className="group flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm transition-all"
                            >
                                <div 
                                    className="flex items-center gap-4 flex-1 cursor-pointer min-w-0"
                                    onClick={() => toggleItem(item.id, item.isPurchased)}
                                >
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors">
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-[16px] truncate">{item.name}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{item.category}</p>
                                            {item.addedBy && (
                                                <>
                                                    <span className="text-[10px] text-slate-300">•</span>
                                                    <p className="text-[10px] text-primary font-bold">Added by {item.addedBy}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity Badge / Editor */}
                                <div className="ml-3 flex-shrink-0">
                                    {editingQtyId === item.id ? (
                                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-black/40 rounded-lg p-1 animate-in fade-in zoom-in duration-200">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity - 1); }}
                                                className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-surface-dark shadow-sm active:scale-90 text-slate-700 dark:text-white"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-bold text-sm min-w-[1.2rem] text-center">{item.quantity}</span>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity + 1); }}
                                                className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-surface-dark shadow-sm active:scale-90 text-slate-700 dark:text-white"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setEditingQtyId(null); }}
                                                className="ml-1 w-6 h-8 flex items-center justify-center text-slate-400 hover:text-primary"
                                            >
                                                <Check size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setEditingQtyId(item.id); }}
                                            className="bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 transition-colors px-3 py-1.5 rounded-lg text-xs font-bold"
                                        >
                                            x{item.quantity}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Separator */}
                        {purchasedItems.length > 0 && activeItems.length > 0 && (
                            <div className="px-2 mt-8 mb-2 flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Purchased ({purchasedItems.length})</span>
                                <div className="flex-1 h-[1px] bg-slate-200 dark:bg-white/10"></div>
                            </div>
                        )}

                        {/* Purchased Items */}
                        {purchasedItems.map(item => (
                            <div 
                                key={item.id}
                                onClick={() => toggleItem(item.id, item.isPurchased)}
                                className="group flex items-center justify-between p-4 bg-transparent rounded-2xl opacity-50 cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                        <Check size={14} className="text-background-dark" strokeWidth={4} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-[16px] line-through text-slate-900 dark:text-white truncate">
                                            {item.name} 
                                            <span className="text-sm opacity-70 ml-2 font-normal no-line-through">(x{item.quantity})</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Complete Trip Modal */}
            {isCompletingTrip && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold dark:text-white">Complete Trip</h2>
                            <button 
                                onClick={() => setIsCompletingTrip(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 mb-6 max-h-40 overflow-y-auto">
                            <p className="text-sm text-slate-500 mb-2">Purchased Items:</p>
                            <div className="flex flex-wrap gap-2">
                                {purchasedItems.map(i => (
                                    <span key={i.id} className="text-xs bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                        {i.name} <span className="text-primary font-bold">x{i.quantity}</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Total Amount Spent</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary">$</span>
                                <input 
                                    type="number" 
                                    value={tripTotal}
                                    onChange={(e) => setTripTotal(e.target.value)}
                                    placeholder="0.00"
                                    autoFocus
                                    className="w-full bg-slate-100 dark:bg-black/40 border-none rounded-2xl py-4 pl-10 pr-4 text-3xl font-bold text-slate-900 dark:text-white placeholder-slate-300 focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleCompleteTrip}
                            disabled={isSavingTrip || !tripTotal}
                            className="w-full bg-primary text-background-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50 hover:bg-primary-dark"
                        >
                            {isSavingTrip ? <Loader2 className="animate-spin" /> : <> <ShoppingBag size={20} /> Save Expense & Clear List </>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};