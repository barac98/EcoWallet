import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, ChevronRight, CheckCircle, Delete, Loader2 } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../constants';
import * as Icons from 'lucide-react';
import { api } from '../api';

export const AddExpense = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('0');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNumberClick = (num: string) => {
        if (amount === '0' && num !== '.') {
            setAmount(num);
        } else {
            if (num === '.' && amount.includes('.')) return;
            setAmount(prev => prev + num);
        }
    };

    const handleDelete = () => {
        setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    };

    const handleSubmit = async () => {
        if (!selectedCategory || parseFloat(amount) === 0) return;

        setIsSubmitting(true);
        const categoryDetails = EXPENSE_CATEGORIES.find(c => c.id === selectedCategory);
        
        await api.addTransaction({
            title: description || categoryDetails?.name || 'Expense',
            category: categoryDetails?.name || 'Other',
            amount: parseFloat(amount),
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
        <div className="fixed inset-0 bg-black z-[60] flex flex-col">
            <div className="flex-1 bg-background-light dark:bg-background-dark flex flex-col relative">
                 {/* Modal Header */}
                <div className="flex justify-between items-center px-6 py-4">
                    <h2 className="text-slate-400 text-sm font-medium tracking-wide">ADD EXPENSE</h2>
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col px-6 overflow-y-auto">
                    {/* Amount Display */}
                    <div className="flex flex-col items-center justify-center my-8">
                        <div className="flex items-baseline gap-1">
                            <span className="text-primary text-3xl font-medium">$</span>
                            <span className="text-slate-900 dark:text-white text-6xl font-bold tracking-tight">{amount}</span>
                        </div>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-slate-400 text-sm">Description</span>
                            <input 
                                className="bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 w-full p-0 text-right font-medium" 
                                placeholder="What was this for?" 
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                            <Calendar size={20} className="text-slate-400" />
                            <span className="text-slate-900 dark:text-white font-medium">Today</span>
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-slate-500 text-sm">Now</span>
                                <ChevronRight size={16} className="text-slate-500" />
                            </div>
                        </div>
                    </div>

                    {/* Category Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {EXPENSE_CATEGORIES.map(cat => (
                            <div 
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className="flex flex-col items-center gap-2 cursor-pointer group"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 
                                    ${selectedCategory === cat.id 
                                        ? 'bg-primary text-background-dark scale-110 shadow-lg shadow-primary/30' 
                                        : 'bg-white dark:bg-white/5 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-white/5'}`}
                                >
                                    <DynamicIcon name={cat.icon} />
                                </div>
                                <span className={`text-xs font-medium ${selectedCategory === cat.id ? 'text-primary' : 'text-slate-500'}`}>
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Keypad */}
                    <div className="mt-auto mb-8 grid grid-cols-3 gap-y-6 text-2xl font-medium text-slate-900 dark:text-white select-none">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((key) => (
                            <button 
                                key={key} 
                                onClick={() => handleNumberClick(key.toString())}
                                className="flex justify-center items-center py-2 active:opacity-50 hover:bg-white/5 rounded-lg"
                            >
                                {key}
                            </button>
                        ))}
                        <button 
                            onClick={handleDelete}
                            className="flex justify-center items-center py-2 active:opacity-50 hover:bg-white/5 rounded-lg text-slate-400"
                        >
                            <Delete size={28} />
                        </button>
                    </div>

                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selectedCategory}
                        className={`w-full bg-primary hover:bg-primary-dark text-background-dark font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] mb-8 flex items-center justify-center gap-2 ${(!selectedCategory || isSubmitting) ? 'opacity-50' : ''}`}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <><span>Add Expense</span><CheckCircle size={20} /></>}
                    </button>
                </div>
            </div>
        </div>
    );
};