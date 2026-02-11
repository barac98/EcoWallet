import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Trash2, Calendar, FileText } from 'lucide-react';
import { Transaction } from '../types';
import { api } from '../api';
import { EXPENSE_CATEGORIES } from '../constants';

interface EditTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
    onSaveSuccess: () => void;
}

export const EditTransactionModal = ({ isOpen, onClose, transaction, onSaveSuccess }: EditTransactionModalProps) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (transaction && isOpen) {
            setTitle(transaction.title);
            setAmount(transaction.amount.toString());
            
            const d = new Date(transaction.date);
            // Format for datetime-local input (YYYY-MM-DD)
            setDate(d.toISOString().split('T')[0]);
            setTime(d.toTimeString().slice(0, 5));
            setType(transaction.type);
        }
    }, [transaction, isOpen]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transaction) return;
        
        setIsSubmitting(true);
        try {
            const combinedDate = new Date(`${date}T${time}:00`);
            
            await api.updateTransaction(transaction.id, {
                title,
                amount: parseFloat(amount),
                date: combinedDate.toISOString(),
                type
            });
            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to update", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!transaction) return;
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;

        setIsDeleting(true);
        try {
            await api.deleteTransaction(transaction.id);
            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to delete", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen || !transaction) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6 animate-in fade-in duration-200">
            <div className="bg-surface-card w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 border-t sm:border border-white/10 shadow-2xl h-[90vh] sm:h-auto flex flex-col">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h2 className="text-xl font-bold text-white">Edit Transaction</h2>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                    
                    {/* Amount Input */}
                    <div className="text-center">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Amount</label>
                        <div className="relative inline-flex items-center justify-center">
                            <span className={`text-2xl font-bold mr-1 ${type === 'income' ? 'text-primary' : 'text-white'}`}>$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={`bg-transparent border-b-2 border-white/10 py-1 text-4xl font-bold text-center w-40 focus:border-primary focus:outline-none placeholder-slate-700 ${type === 'income' ? 'text-primary' : 'text-white'}`}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Toggle Type */}
                    <div className="flex bg-white/5 p-1 rounded-xl">
                        <button 
                            type="button"
                            onClick={() => setType('expense')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === 'expense' ? 'bg-white text-background-dark shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            Expense
                        </button>
                        <button 
                            type="button"
                            onClick={() => setType('income')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === 'income' ? 'bg-primary text-background-dark shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            Income
                        </button>
                    </div>

                    {/* Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-500 mb-1 block pl-1">Description</label>
                            <div className="flex items-center bg-white/5 rounded-xl px-4 py-3 border border-white/5 focus-within:border-primary/50 transition-colors">
                                <FileText size={18} className="text-slate-400 mr-3" />
                                <input 
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500"
                                    placeholder="Description"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block pl-1">Date</label>
                                <div className="flex items-center bg-white/5 rounded-xl px-3 py-3 border border-white/5">
                                    <Calendar size={18} className="text-slate-400 mr-2" />
                                    <input 
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="bg-transparent border-none outline-none w-full text-white text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block pl-1">Time</label>
                                <div className="flex items-center bg-white/5 rounded-xl px-3 py-3 border border-white/5">
                                    <input 
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="bg-transparent border-none outline-none w-full text-white text-sm text-center"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-3 mt-auto">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-500/10 text-red-500 font-bold p-4 rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-colors active:scale-95 disabled:opacity-50"
                        >
                            {isDeleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-primary text-background-dark font-bold p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Save Changes <Check size={20} /></>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};