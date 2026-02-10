import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, ChevronRight, CheckCircle, Loader2, FileText, AlignLeft } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../constants';
import * as Icons from 'lucide-react';
import { api } from '../api';

export const AddExpense = () => {
    const navigate = useNavigate();
    
    // State
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Refs
    const amountInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus amount on mount
    useEffect(() => {
        if (amountInputRef.current) {
            amountInputRef.current.focus();
        }
    }, []);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        const numAmount = parseFloat(amount);
        if (!selectedCategory || isNaN(numAmount) || numAmount <= 0) return;

        setIsSubmitting(true);
        const categoryDetails = EXPENSE_CATEGORIES.find(c => c.id === selectedCategory);
        
        await api.addTransaction({
            title: description || categoryDetails?.name || 'Expense',
            category: categoryDetails?.name || 'Other',
            amount: numAmount,
            date: new Date().toISOString(),
            type: 'expense',
            icon: categoryDetails?.icon || 'Zap'
        });

        setIsSubmitting(false);
        navigate('/');
    };

    const DynamicIcon = ({ name, size = 24 }: { name: string, size?: number }) => {
        const LucideIcon = (Icons as any)[name];
        return LucideIcon ? <LucideIcon size={size} /> : null;
    };

    return (
        <div className="fixed inset-0 bg-background-dark z-[60] flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 shrink-0">
                <h2 className="text-slate-400 text-sm font-medium tracking-wide">ADD EXPENSE</h2>
                <button 
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 overflow-y-auto no-scrollbar">
                
                {/* 1. Big Amount Input */}
                <div className="mt-6 mb-10 flex justify-center">
                    <div className="relative flex items-center justify-center w-full">
                        <span className={`text-4xl font-bold mr-2 pb-2 transition-colors ${amount ? 'text-primary' : 'text-slate-600'}`}>$</span>
                        <input
                            ref={amountInputRef}
                            type="number"
                            inputMode="decimal"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-transparent border-none outline-none text-center text-7xl font-bold text-primary placeholder-slate-700 caret-white p-0 m-0"
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    
                    {/* 2. Note Input */}
                    <div className="bg-surface-card rounded-2xl border border-white/5 flex items-center p-4 transition-all focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 mr-3 shrink-0">
                            <FileText size={20} />
                        </div>
                        <input 
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a note..."
                            className="bg-transparent border-none outline-none text-lg text-white placeholder-slate-500 w-full"
                        />
                    </div>

                    {/* Date Row (Visual Only for now) */}
                    <div className="bg-surface-card rounded-2xl border border-white/5 flex items-center p-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 mr-3 shrink-0">
                            <Calendar size={20} />
                        </div>
                        <span className="text-lg text-white font-medium">Today</span>
                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-slate-500 text-sm">Now</span>
                            <ChevronRight size={16} className="text-slate-500" />
                        </div>
                    </div>

                    {/* 3. Category Grid */}
                    <div className="pt-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Select Category</label>
                        <div className="grid grid-cols-4 gap-4 pb-24">
                            {EXPENSE_CATEGORIES.map(cat => {
                                const isSelected = selectedCategory === cat.id;
                                return (
                                    <button 
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 border
                                            ${isSelected 
                                                ? 'bg-primary text-background-dark border-primary scale-105 shadow-lg shadow-primary/20' 
                                                : 'bg-surface-card text-slate-400 border-white/5 hover:bg-white/10'}`}
                                        >
                                            <DynamicIcon name={cat.icon} size={28} />
                                        </div>
                                        <span className={`text-xs font-medium transition-colors ${isSelected ? 'text-primary' : 'text-slate-500'}`}>
                                            {cat.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </form>

            {/* 4. Footer Button (Sticky Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-10">
                <button 
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting || !amount || !selectedCategory}
                    className="w-full bg-primary hover:bg-primary-dark text-background-dark font-bold text-lg py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <>Save Expense <CheckCircle size={20} /></>}
                </button>
            </div>
        </div>
    );
};