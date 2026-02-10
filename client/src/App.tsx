import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { ShoppingList } from './components/ShoppingList';
import { BudgetHistory } from './components/BudgetHistory';
import { AddExpense } from './components/AddExpense';
import { LayoutGrid, Wallet, PieChart, User, Plus } from 'lucide-react';

const BottomNavigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    if (location.pathname === '/add') return null;

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 px-6 pb-8 pt-4 flex justify-between items-center z-50">
            <button 
                onClick={() => navigate('/')}
                className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-primary' : 'text-slate-400'}`}
            >
                <LayoutGrid size={24} />
                <span className="text-[10px] font-bold">Overview</span>
            </button>
            <button 
                onClick={() => navigate('/shopping')}
                className={`flex flex-col items-center gap-1 transition-colors ${isActive('/shopping') ? 'text-primary' : 'text-slate-400'}`}
            >
                <Wallet size={24} />
                <span className="text-[10px] font-bold">Shopping</span>
            </button>
            
            <div className="w-12"></div>

            <button 
                onClick={() => navigate('/history')}
                className={`flex flex-col items-center gap-1 transition-colors ${isActive('/history') ? 'text-primary' : 'text-slate-400'}`}
            >
                <PieChart size={24} />
                <span className="text-[10px] font-bold">Analytics</span>
            </button>
            <button 
                className={`flex flex-col items-center gap-1 transition-colors ${isActive('/profile') ? 'text-primary' : 'text-slate-400'}`}
            >
                <User size={24} />
                <span className="text-[10px] font-bold">Profile</span>
            </button>

            <button 
                onClick={() => navigate('/add')}
                className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 bg-primary text-background-dark rounded-full flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform"
            >
                <Plus size={28} strokeWidth={2.5} />
            </button>
        </nav>
    );
};

export default function App() {
  return (
    <Router>
        <div className="antialiased min-h-screen pb-24">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/shopping" element={<ShoppingList />} />
                <Route path="/history" element={<BudgetHistory />} />
                <Route path="/add" element={<AddExpense />} />
            </Routes>
            <BottomNavigation />
        </div>
    </Router>
  );
}