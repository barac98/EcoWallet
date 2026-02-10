export interface Transaction {
    id: string;
    title: string;
    category: string;
    amount: number;
    date: string; // ISO date string
    type: 'income' | 'expense';
    icon: string;
}

export interface ShoppingItem {
    id: string;
    name: string;
    quantity: number;
    category?: string; // 'groceries' | 'electronics' etc
    checked: boolean;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export type Period = 'Weekly' | 'Monthly' | 'Yearly';

export interface ChartData {
    name: string;
    income: number;
    expense: number;
}