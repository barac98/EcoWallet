import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Bell, 
    Edit2, 
    ShoppingBag, 
    Coffee, 
    Home, 
    DollarSign, 
    Music, 
    Zap, 
    Loader2,
    X,
    Check
} from 'lucide-react';
import { Transaction, ShoppingItem } from '../types';
import { api } from '../api';
import { useUser } from '../UserContext';

// --- Icon Helper ---
const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'Coffee': return <Coffee size={24} />;
        case 'ShoppingBag': return <ShoppingBag size={24} />;
        case 'Home': return <Home size={24} />;
        case 'DollarSign': return <DollarSign size={24} />;
        case 'Music': return <Music size={24} />;
        default: return <Zap size={24} />;
    }
};

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Groceries': return 'bg-emerald-500/20 text-emerald-500';
        case 'Food & Drinks': return 'bg-orange-500/20 text-orange-500';
        case 'Entertainment': return 'bg-purple-500/20 text-purple-500';
        case 'Income': return 'bg-primary/20 text-primary';
        default: return 'bg-blue-500/20 text-blue-500';
    }
};

export const Dashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    
    // Data State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    // UI State
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [newIncomeAmount, setNewIncomeAmount] = useState('');

    // --- Data Loading ---
    const loadData = async () => {
        setLoading(true);
        const [txData, shopData] = await Promise.all([
            api.getTransactions(),
            api.getShoppingItems()
        ]);
        setTransactions(txData);
        setShoppingItems(shopData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- Calculations ---
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = useMemo(() => {
        return transactions.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
    }, [transactions, currentMonth, currentYear]);

    const totalIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const remainingBalance = totalIncome - totalExpense;
    const spendPercentage = totalIncome > 0 ? Math.min((totalExpense / totalIncome) * 100, 100) : 0;

    const pendingShoppingCount = shoppingItems.filter(i => !i.isPurchased).length;
    const totalShoppingCount = shoppingItems.length;
    const shoppingProgress = totalShoppingCount > 0 
        ? ((totalShoppingCount - pendingShoppingCount) / totalShoppingCount) * 100 
        : 0;

    // --- Greeting Logic ---
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    // --- Handlers ---
    const handleAddIncome = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(newIncomeAmount);
        if (!amount || amount <= 0) return;

        await api.addTransaction({
            title: 'Monthly Income',
            amount: amount,
            category: 'Income',
            date: new Date().toISOString(),
            type: 'income',
            icon: 'DollarSign'
        });

        setShowIncomeModal(false);
        setNewIncomeAmount('');
        loadData();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark text-white pb-32 font-sans">
            
            {/* 1. Header Section */}
            <header className="px-6 pt-8 pb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-card border border-white/10 flex items-center justify-center text-primary font-bold shadow-lg">
                        {user ? user[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">{getGreeting()},</p>
                        <h1 className="text-xl font-bold">{user || 'Guest'}</h1>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-surface-card border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Bell size={20} />
                </button>
            </header>

            <main className="px-6 space-y-6">
                
                {/* 2. Income & Balance Cards */}
                <div className="grid gap-4">
                    {/* Income Card */}
                    <div className="bg-surface-card rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <span className="text-slate-400 text-sm font-medium">Total Monthly Income</span>
                            <button 
                                onClick={() => setShowIncomeModal(true)}
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary hover:bg-primary hover:text-background-dark transition-all"
                            >
                                <Edit2 size={14} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 relative z-10">
                            <h2 className="text-3xl font-bold tracking-tight">${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">+12%</span>
                        </div>
                        
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    </div>

                    {/* Balance Card */}
                    <div className="bg-black rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="mb-6 relative z-10">
                            <span className="text-slate-400 text-sm font-medium">Remaining Balance</span>
                            <h2 className="text-4xl font-bold tracking-tight mt-1 text-white">${remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                        </div>
                        
                        <div className="space-y-2 relative z-10">
                            <div className="flex justify-between text-xs font-bold tracking-wider uppercase">
                                <span className="text-primary">Spending Progress</span>
                                <span className="text-slate-400">{Math.round(spendPercentage)}% Used</span>
                            </div>
                            <div className="h-3 w-full bg-surface-card rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(19,236,91,0.5)] transition-all duration-700 ease-out"
                                    style={{ width: `${spendPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Recent Transactions */}
                <div>
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-lg font-bold">Recent Transactions</h3>
                        <button onClick={() => navigate('/history')} className="text-primary text-sm font-bold hover:underline">See All</button>
                    </div>
                    
                    <div className="space-y-3">
                        {transactions.slice(0, 3).map(t => (
                            <div key={t.id} className="bg-surface-card border border-white/5 p-4 rounded-3xl flex items-center justify-between group active:scale-[0.99] transition-transform">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getCategoryColor(t.category)}`}>
                                        {getIcon(t.icon)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{t.title}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                            <span>{t.category}</span>
                                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                            <span>{new Date(t.date).toLocaleDateString([], { weekday: 'short' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`font-bold ${t.type === 'income' ? 'text-primary' : 'text-white'}`}>
                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                </span>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <div className="text-center py-8 text-slate-500 text-sm bg-surface-card rounded-3xl border border-white/5">
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Shopping Summary Card */}
                <div 
                    onClick={() => navigate('/shopping')}
                    className="bg-[#1a237e] rounded-3xl p-5 border border-white/10 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
                    
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <ShoppingBag size={20} fill="currentColor" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-0.5">Shopping Summary</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-white">
                                    {pendingShoppingCount > 0 ? `${pendingShoppingCount} Items Pending` : 'All Done!'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-right">
                        <span className="text-xs font-bold text-blue-300 block mb-1">{Math.round(shoppingProgress)}% Goal</span>
                         {/* Circular Progress (Simplified visual) */}
                         <div className="w-8 h-1 bg-blue-900/50 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${shoppingProgress}%` }}></div>
                         </div>
                    </div>
                </div>

            </main>

            {/* --- Edit Income Modal --- */}
            {showIncomeModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="bg-surface-card w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Update Income</h2>
                            <button 
                                onClick={() => setShowIncomeModal(false)}
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddIncome}>
                            <div className="mb-6">
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Add Income Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-primary">$</span>
                                    <input 
                                        type="number" 
                                        value={newIncomeAmount}
                                        onChange={(e) => setNewIncomeAmount(e.target.value)}
                                        placeholder="0.00"
                                        autoFocus
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-2xl font-bold text-white placeholder-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-2 ml-1">This will be added as a new transaction.</p>
                            </div>

                            <button 
                                type="submit"
                                disabled={!newIncomeAmount}
                                className="w-full bg-primary text-background-dark font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50 hover:bg-primary-dark"
                            >
                                <Check size={20} />
                                Confirm Income
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};