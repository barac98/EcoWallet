import { Transaction, ShoppingItem } from './types';

// PRODUCTION: Set VITE_API_URL in your static host (e.g., Render) to your backend URL + /api
// DEVELOPMENT: Falls back to '/api' which Vite proxies to localhost:3001
const API_URL = import.meta.env.VITE_API_URL || '/api';

const getCurrentUser = () => localStorage.getItem('ecowallet_user') || 'Family';

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
    // Transactions
    getTransactions: () => fetchWithFallback<Transaction[]>('/transactions', 'transactions'),
    
    addTransaction: async (transaction: Omit<Transaction, 'id'>) => {
        try {
            const payload = {
                ...transaction,
                createdBy: getCurrentUser()
            };

            const res = await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if(!res.ok) throw new Error("Failed to add");
            return await res.json();
        } catch (e) {
            console.error(e);
            alert("Could not save online. Check connection.");
            return null;
        }
    },

    // Shopping
    getShoppingItems: () => fetchWithFallback<ShoppingItem[]>('/shopping', 'shopping'),

    addShoppingItem: async (item: Omit<ShoppingItem, 'id'>) => {
        const payload = {
            ...item,
            addedBy: getCurrentUser(),
            isPurchased: false,
            boughtBy: null
        };

        const res = await fetch(`${API_URL}/shopping`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return res.json();
    },

    updateShoppingItem: async (id: string, updates: Partial<ShoppingItem>) => {
        const payload = { ...updates };
        
        // If checking/unchecking, update the 'boughtBy' field
        if ('isPurchased' in updates) {
            payload.boughtBy = updates.isPurchased ? getCurrentUser() : undefined; 
        }

        await fetch(`${API_URL}/shopping/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    },

    clearPurchasedItems: async () => {
        await fetch(`${API_URL}/shopping/clear-purchased`, {
            method: 'DELETE'
        });
    }
};