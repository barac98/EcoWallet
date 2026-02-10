import { Transaction, ShoppingItem, ChartData, Category } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        title: 'Starbucks Coffee',
        category: 'Food & Drinks',
        amount: 5.50,
        date: new Date().toISOString(),
        type: 'expense',
        icon: 'Coffee'
    },
    {
        id: '2',
        title: 'Apple Subscription',
        category: 'Entertainment',
        amount: 12.99,
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        type: 'expense',
        icon: 'Music'
    },
    {
        id: '3',
        title: 'Grocery Store',
        category: 'Groceries',
        amount: 142.00,
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        type: 'expense',
        icon: 'ShoppingBag'
    },
    {
        id: '4',
        title: 'Monthly Salary',
        category: 'Income',
        amount: 4500.00,
        date: new Date(Date.now() - 259200000).toISOString(),
        type: 'income',
        icon: 'DollarSign'
    }
];

export const INITIAL_SHOPPING_ITEMS: ShoppingItem[] = [
    { id: '1', name: 'Organic Avocado', quantity: 3, isPurchased: false, category: 'Groceries', addedBy: 'Mom' },
    { id: '2', name: 'Almond Milk', quantity: 1, isPurchased: false, category: 'Groceries', addedBy: 'Dad' },
    { id: '3', name: 'Fresh Blueberries', quantity: 2, isPurchased: false, category: 'Groceries', addedBy: 'Mom' },
    { id: '4', name: 'Sourdough Bread', quantity: 1, isPurchased: false, category: 'Groceries', addedBy: 'Family' },
    { id: '5', name: 'Greek Yogurt', quantity: 4, isPurchased: true, category: 'Groceries', addedBy: 'Mom' },
    { id: '6', name: 'Sparkling Water', quantity: 6, isPurchased: true, category: 'Groceries', addedBy: 'Dad' }
];

export const CHART_DATA: ChartData[] = [
    { name: 'APR', income: 4000, expense: 2400 },
    { name: 'MAY', income: 3000, expense: 1398 },
    { name: 'JUN', income: 2000, expense: 9800 }, // High expense
    { name: 'JUL', income: 2780, expense: 3908 },
    { name: 'AUG', income: 1890, expense: 4800 },
    { name: 'SEP', income: 2390, expense: 3800 },
    { name: 'OCT', income: 3490, expense: 4300 },
];

export const EXPENSE_CATEGORIES: Category[] = [
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'bg-primary' },
    { id: 'food', name: 'Food', icon: 'Utensils', color: 'bg-orange-500' },
    { id: 'transport', name: 'Transport', icon: 'Car', color: 'bg-blue-500' },
    { id: 'grocery', name: 'Grocery', icon: 'ShoppingBag', color: 'bg-green-500' },
    { id: 'bills', name: 'Bills', icon: 'Zap', color: 'bg-yellow-500' },
    { id: 'movies', name: 'Movies', icon: 'Clapperboard', color: 'bg-purple-500' },
    { id: 'health', name: 'Health', icon: 'Activity', color: 'bg-red-500' },
    { id: 'other', name: 'Other', icon: 'MoreHorizontal', color: 'bg-slate-500' },
];