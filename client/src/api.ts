import { Transaction, ShoppingItem } from './types';

// Use relative path so Vite proxy handles it
const API_URL = '/api';

async function fetchWithFallback<T>(endpoint: string, cacheKey: string, options?: RequestInit): Promise<T> {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        // Cache successful GET requests
        if (!options || options.method === 'GET') {
            localStorage.setItem(cacheKey, JSON.stringify(data));
        }
        
        return data;
    } catch (error) {
        console.warn(`API Error for ${endpoint}, falling back to cache.`, error);
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        if (!options || options.method === 'GET') {
            return [] as any; 
        }
        throw error;
    }
}

export const api = {
    getTransactions: () => fetchWithFallback<Transaction[]>('/transactions', 'transactions'),
    
    addTransaction: async (transaction: Omit<Transaction, 'id'>) => {
        try {
            const res = await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaction)
            });
            if(!res.ok) throw new Error("Failed to add");
            return await res.json();
        } catch (e) {
            console.error(e);
            alert("Could not save online. Check connection.");
            return null;
        }
    },

    getShoppingItems: () => fetchWithFallback<ShoppingItem[]>('/shopping', 'shopping'),

    addShoppingItem: async (item: Omit<ShoppingItem, 'id'>) => {
        const res = await fetch(`${API_URL}/shopping`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        return res.json();
    },

    toggleShoppingItem: async (id: string, checked: boolean) => {
        await fetch(`${API_URL}/shopping/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ checked })
        });
    },

    clearPurchasedItems: async () => {
        await fetch(`${API_URL}/shopping/clear-purchased`, {
            method: 'DELETE'
        });
    }
};