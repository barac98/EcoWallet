import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    writeBatch, 
    getDocs, 
    query, 
    where 
} from 'firebase/firestore';
import { db } from './firebase';
import { Transaction, ShoppingItem } from './types';

// Helper to get current user from local storage
const getCurrentUser = () => localStorage.getItem('ecowallet_user') || 'Family';

// NOTE: Reads are now handled by the useFirestore hook (onSnapshot) for real-time updates.
// This file handles Writes using the Firebase SDK to ensure offline persistence.

export const api = {
    // --- Transactions ---

    // (Legacy/One-off fetch)
    getTransactions: async () => {
        const q = query(collection(db, 'transactions'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Transaction[];
    },
    
    addTransaction: async (transaction: Omit<Transaction, 'id'>) => {
        try {
            const payload = {
                ...transaction,
                createdBy: getCurrentUser(),
                // Ensure date is saved as ISO string if not already
                date: transaction.date || new Date().toISOString()
            };
            
            const docRef = await addDoc(collection(db, 'transactions'), payload);
            return { id: docRef.id, ...payload };
        } catch (e) {
            console.error("Error adding transaction:", e);
            throw e;
        }
    },

    // --- Shopping ---

    // (Legacy/One-off fetch)
    getShoppingItems: async () => {
        const q = query(collection(db, 'shopping'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ShoppingItem[];
    },

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
        try {
            // 1. Query items where isPurchased == true
            const q = query(collection(db, 'shopping'), where('isPurchased', '==', true));
            const snapshot = await getDocs(q);

            // 2. Batch delete
            const batch = writeBatch(db);
            snapshot.docs.forEach((document) => {
                batch.delete(document.ref);
            });

            await batch.commit();
        } catch (e) {
            console.error("Error clearing items:", e);
            throw e;
        }
    }
};
