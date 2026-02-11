import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { api } from '../api';

interface EditIncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentIncome: number;
    selectedMonth: Date;
    onSaveSuccess?: () => void;
}

export const EditIncomeModal = ({ isOpen, onClose, currentIncome, selectedMonth, onSaveSuccess }: EditIncomeModalProps) => {
    const [amount, setAmount] = useState(currentIncome.toString());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync local state when prop changes
    useEffect(() => {
        setAmount(currentIncome > 0 ? currentIncome.toString() : '');
    }, [currentIncome, isOpen]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const year = selectedMonth.getFullYear();
        const month = String(selectedMonth.getMonth() + 1).padStart(2, '0');
        const docId = `${year}-${month}`; // e.g., "2023-10"

        try {
            await api.setIncome(docId, parseFloat(amount) || 0);
            if (onSaveSuccess) onSaveSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving income:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const monthName = selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-surface-card w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Set Income</h2>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSave}>
                    <div className="mb-8 text-center">
                        <p className="text-slate-400 text-sm font-medium mb-4">Budget for <span className="text-white">{monthName}</span></p>
                        <div className="relative inline-flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary mr-1">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-transparent border-b-2 border-white/10 py-2 text-4xl font-bold text-white text-center w-40 focus:border-primary focus:outline-none placeholder-slate-700"
                                placeholder="0"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-colors active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary text-background-dark font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Save Update <Check size={20} /></>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};