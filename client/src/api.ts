import { Transaction, ShoppingItem } from './types';
import { config } from './config';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    doc, 
    writeBatch, 
    getDocs, 
    query, 
    where 
} from 'firebase/firestore';
import { db } from './firebase';

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
        // If no cache and read operation, return empty array
        if (!options || options.method === 'GET') {
            return [] as any; 
        }
        throw error;
    }
}

// Helper to get current user from local storage
const getCurrentUser = () => localStorage.getItem('ecowallet_user') || 'Family';

// NOTE: Reads are now handled by the useFirestore hook (onSnapshot) for real-time updates.
// This file handles Writes using the Firebase SDK to ensure offline persistence, 
// OR calls custom backend endpoints where server-side logic is needed (like batch delete).

export const api = {
    // --- Transactions ---

    // (Legacy/One-off fetch)
    getTransactions: () => fetchWithFallback<Transaction[]>('/transactions', 'transactions'),
    
    addTransaction: async (transaction: Omit<Transaction, 'id'>) => {
        try {
            const payload = {
                ...transaction,
                createdBy: getCurrentUser(),
                // Ensure date is saved as ISO string if not already
                date: transaction.date || new Date().toISOString()
            };
            
            // Write directly to Firestore for offline persistence support
            const docRef = await addDoc(collection(db, 'transactions'), payload);
            return { id: docRef.id, ...payload };
        } catch (e) {
            console.error("Error adding transaction:", e);
            throw e;
        }
    },

    // --- Shopping ---

    // (Legacy/One-off fetch)
    getShoppingItems: () => fetchWithFallback<ShoppingItem[]>('/shopping', 'shopping'),

    addShoppingItem: async (item: Omit<ShoppingItem, 'id'>) => {
        try {
            const payload = {
                ...item,
                addedBy: item.addedBy || getCurrentUser(),
                createdAt: new Date().toISOString() // Useful for sorting
            };
            
            const docRef = await addDoc(collection(db, 'shopping'), payload);
            return { id: docRef.id, ...payload };
        } catch (e) {
            console.error("Error adding shopping item:", e);
            throw e;
        }
    },

    updateShoppingItem: async (id: string, updates: Partial<ShoppingItem>) => {
        try {
            const docRef = doc(db, 'shopping', id);
            await updateDoc(docRef, updates);
        } catch (e) {
            console.error("Error updating item:", e);
            throw e;
        }
    },

    clearPurchasedItems: async () => {
        // This is a complex batch operation. 
        // We can either do it client-side via SDK or hit the backend endpoint.
        // Hitting backend endpoint ensures logic centralization, but offline we might prefer SDK.
        // For consistency with "Complete Trip" workflow in instructions, we'll use the API endpoint
        // which handles the batch logic on the server.
        try {
            const response = await fetch(`${API_URL}/shopping/clear-purchased`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error("Failed to clear items");
        } catch (e) {
            // Fallback: Client side batch delete if server fails/offline
            console.warn("Server clear failed, attempting client-side batch delete", e);
            const q = query(collection(db, 'shopping'), where('isPurchased', '==', true));
            const snapshot = await getDocs(q);
            const batch = writeBatch(db);
            snapshot.docs.forEach((document) => {
                batch.delete(document.ref);
            });
            await batch.commit();
        }
    }
};