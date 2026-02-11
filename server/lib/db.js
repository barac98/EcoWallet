const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

let db;
// Construct path relative to the server root (one level up from lib)
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

// In-Memory Fallback Store
const memoryStore = {
    transactions: [
        { id: '1', title: 'Starbucks Coffee', category: 'Food & Drinks', amount: 5.50, date: new Date().toISOString(), type: 'expense', icon: 'Coffee', createdBy: 'Dad' },
        { id: '2', title: 'Apple Subscription', category: 'Entertainment', amount: 12.99, date: new Date(Date.now() - 86400000).toISOString(), type: 'expense', icon: 'Music', createdBy: 'Mom' }
    ],
    shopping: [
        { id: '1', name: 'Organic Avocado', quantity: 3, isPurchased: false, category: 'Groceries', addedBy: 'Mom' },
        { id: '2', name: 'Almond Milk', quantity: 1, isPurchased: false, category: 'Groceries', addedBy: 'Dad' }
    ],
    incomes: [] // Added for income storage
};

// Function to initialize Firebase
const initFirebase = () => {
    try {
        // 1. Try Environment Variables (Preferred for Production/Cloud)
        if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
            const serviceAccount = {
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle newlines in private key which are often escaped in .env files
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            };
            
            initializeApp({
                credential: cert(serviceAccount)
            });
            db = getFirestore();
            console.log("🔥 Firebase Firestore Connected (via Environment Variables)");
            return;
        }

        // 2. Try JSON File (Legacy/Local Development)
        if (fs.existsSync(serviceAccountPath)) {
            const serviceAccount = require(serviceAccountPath);
            initializeApp({
                credential: cert(serviceAccount)
            });
            db = getFirestore();
            console.log("🔥 Firebase Firestore Connected (via JSON File)");
            return;
        }

        throw new Error("No credentials found");
    } catch (error) {
        console.error("Firebase init failed:", error.message);
        console.log("⚠️ Using In-Memory Database (Data will be lost on restart)");
    }
};

// --- Helpers ---

const getCollection = async (collectionName) => {
    if (db) {
        const snapshot = await db.collection(collectionName).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
        return memoryStore[collectionName] || [];
    }
};

const getDocument = async (collectionName, id) => {
    if (db) {
        const doc = await db.collection(collectionName).doc(id).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } else {
        return (memoryStore[collectionName] || []).find(item => item.id === id) || null;
    }
}

const addDocument = async (collectionName, data) => {
    if (db) {
        const docRef = await db.collection(collectionName).add(data);
        return { id: docRef.id, ...data };
    } else {
        const newItem = { id: Date.now().toString(), ...data };
        if (!memoryStore[collectionName]) memoryStore[collectionName] = [];
        memoryStore[collectionName].push(newItem);
        return newItem;
    }
};

const updateDocument = async (collectionName, id, data) => {
    if (db) {
        await db.collection(collectionName).doc(id).update(data);
        return { id, ...data };
    } else {
        const list = memoryStore[collectionName];
        const idx = list.findIndex(item => item.id === id);
        if (idx !== -1) {
            memoryStore[collectionName][idx] = { ...list[idx], ...data };
            return memoryStore[collectionName][idx];
        }
        return null;
    }
};

// Upsert (Set with merge)
const setDocument = async (collectionName, id, data) => {
    if (db) {
        await db.collection(collectionName).doc(id).set(data, { merge: true });
        return { id, ...data };
    } else {
        if (!memoryStore[collectionName]) memoryStore[collectionName] = [];
        const idx = memoryStore[collectionName].findIndex(item => item.id === id);
        if (idx !== -1) {
            memoryStore[collectionName][idx] = { ...memoryStore[collectionName][idx], ...data };
        } else {
            memoryStore[collectionName].push({ id, ...data });
        }
        return { id, ...data };
    }
};

const clearPurchasedItems = async () => {
    if (db) {
        const snapshot = await db.collection('shopping').where('isPurchased', '==', true).get();
        
        if (snapshot.empty) {
            return { success: true, count: 0 };
        }

        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        return { success: true, count: snapshot.size };
    } else {
        const initialLength = memoryStore.shopping.length;
        memoryStore.shopping = memoryStore.shopping.filter(i => !i.isPurchased);
        return { success: true, count: initialLength - memoryStore.shopping.length };
    }
};

module.exports = {
    initFirebase,
    getCollection,
    getDocument,
    addDocument,
    updateDocument,
    setDocument,
    clearPurchasedItems
};