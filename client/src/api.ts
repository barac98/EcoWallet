import { Transaction, ShoppingItem } from './types';
import { config } from './config';

const API_URL = config.apiBaseUrl;

// Helper to handle offline fallback for read operations
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
        // Return default empty array for list endpoints if no cache
        if ((!options || options.method === 'GET') && !endpoint.includes('/income/')) {
            return [] as any; 
        }
        // Return default object for income if no cache
        if (endpoint.includes('/income/')) {
            return { amount: 0 } as any;
        }
        throw error;
    }
}

// Helper to get current user from local storage
const getCurrentUser = () => localStorage.getItem('ecowallet_user') || 'Family';

export const api = {
    // --- Transactions ---

    getTransactions: () => fetchWithFallback<Transaction[]>('/transactions', 'transactions'),
    
    addTransaction: async (transaction: Omit<Transaction, 'id'>) => {
        const payload = {
            ...transaction,
            createdBy: getCurrentUser(),
            date: transaction.date || new Date().toISOString()
        };
        
        const res = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if(!res.ok) throw new Error("Failed to add transaction");
        return await res.json();
    },

    updateTransaction: async (id: string, updates: Partial<Transaction>) => {
        const res = await fetch(`${API_URL}/transactions/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if(!res.ok) throw new Error("Failed to update transaction");
        return await res.json();
    },

    deleteTransaction: async (id: string) => {
        const res = await fetch(`${API_URL}/transactions/${id}`, {
            method: 'DELETE'
        });
        if(!res.ok) throw new Error("Failed to delete transaction");
        return await res.json();
    },

    // --- Shopping ---

    getShoppingItems: () => fetchWithFallback<ShoppingItem[]>('/shopping', 'shopping'),

    addShoppingItem: async (item: Omit<ShoppingItem, 'id'>) => {
        const payload = {
            ...item,
            addedBy: item.addedBy || getCurrentUser(),
        };
        
        const res = await fetch(`${API_URL}/shopping`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if(!res.ok) throw new Error("Failed to add shopping item");
        return await res.json();
    },

    updateShoppingItem: async (id: string, updates: Partial<ShoppingItem>) => {
        const res = await fetch(`${API_URL}/shopping/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if(!res.ok) throw new Error("Failed to update item");
        return await res.json();
    },

    clearPurchasedItems: async () => {
        const res = await fetch(`${API_URL}/shopping/clear-purchased`, {
            method: 'DELETE'
        });
        if(!res.ok) throw new Error("Failed to clear items");
        return await res.json();
    },

    // --- Income ---

    getIncome: (monthId: string) => fetchWithFallback<{ amount: number }>(`/income/${monthId}`, `income_${monthId}`),

    setIncome: async (monthId: string, amount: number) => {
        const res = await fetch(`${API_URL}/income/${monthId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, updatedAt: new Date().toISOString() })
        });
        if(!res.ok) throw new Error("Failed to set income");
        return await res.json();
    }
};