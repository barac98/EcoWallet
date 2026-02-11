import { useMemo, useState, useEffect } from 'react';
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
    Loader2
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Transaction, ShoppingItem } from '../types';
import { useUser } from '../UserContext';
import { useFirestore } from '../hooks/useFirestore';
import { EditIncomeModal } from './EditIncomeModal';

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
    
    // Real-Time Data Hooks
    const { data: transactions, loading: loadingTx } = useFirestore<Transaction>('transactions', 'date', 'desc');
    const { data: shoppingItems, loading: loadingShop } = useFirestore<ShoppingItem>('shopping');
    
    // UI State
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    
    // --- Calculations ---
    const currentMonthDate = useMemo(() => new Date(), []);
    const currentMonth = currentMonthDate.getMonth();
    const currentYear = currentMonthDate.getFullYear();

    // New: Fetch Monthly Income (Single Doc)
    const [monthlyIncome, setMonthlyIncome] = useState(0);

    useEffect(() => {
        const month = String(currentMonth + 1).padStart(2, '0');
        const docId = `${currentYear}-${month}`;
        
        const unsubscribe = onSnapshot(doc(db, 'incomes', docId), (docSnapshot) => {
            if (docSnapshot.exists()) {
                setMonthlyIncome(docSnapshot.data().amount || 0);
            } else {
                setMonthlyIncome(0);
            }
        });

        return () => unsubscribe();
    }, [currentMonth, currentYear]);

    const monthlyTransactions = useMemo(() => {
        return transactions.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
    }, [transactions, currentMonth, currentYear]);

    // Note: We now treat 'monthlyIncome' as the source of truth for Income,
    // ignoring transactions with type='income' for the balance calculation to avoid double counting if mixed.
    // However, if your legacy data has income transactions, you might want to hide them or migrate them.
    // For this implementation, we purely use the new 'monthlyIncome' state for the Top Card.

    const totalExpense = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const remainingBalance = monthlyIncome - totalExpense;
    const spendPercentage = monthlyIncome > 0 ? Math.min((totalExpense / monthlyIncome) * 100, 100) : 0;

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

    if (loadingTx && transactions.length === 0) {
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
                            <span className="text-slate-400 text-sm font-medium">Total Monthly Budget</span>
                            <button 
                                onClick={() => setShowIncomeModal(true)}
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary hover:bg-primary hover:text-background-dark transition-all"
                            >
                                <Edit2 size={14} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 relative z-10">
                            <h2 className="text-3xl font-bold tracking-tight">${monthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h2>
                            {/* Removed static percentage */}
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
                        {monthlyTransactions.slice(0, 3).map(t => (
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
                        {monthlyTransactions.length === 0 && (
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
            <EditIncomeModal 
                isOpen={showIncomeModal}
                onClose={() => setShowIncomeModal(false)}
                currentIncome={monthlyIncome}
                selectedMonth={currentMonthDate}
            />
        </div>
    );
};