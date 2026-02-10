const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- Database Setup ---
let db;
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// Check if Firebase service account exists
if (fs.existsSync(serviceAccountPath)) {
    try {
        const serviceAccount = require(serviceAccountPath);
        initializeApp({
            credential: cert(serviceAccount)
        });
        db = getFirestore();
        console.log("🔥 Firebase Firestore Connected");
    } catch (error) {
        console.error("Firebase init failed:", error);
        console.log("⚠️ Using In-Memory Database (Data will be lost on restart)");
    }
} else {
    console.log("⚠️ No serviceAccountKey.json found in server/ directory.");
    console.log("⚠️ Using In-Memory Database (Data will be lost on restart)");
}

// In-Memory Fallback Store
const memoryStore = {
    transactions: [
        { id: '1', title: 'Starbucks Coffee', category: 'Food & Drinks', amount: 5.50, date: new Date().toISOString(), type: 'expense', icon: 'Coffee' },
        { id: '2', title: 'Apple Subscription', category: 'Entertainment', amount: 12.99, date: new Date(Date.now() - 86400000).toISOString(), type: 'expense', icon: 'Music' }
    ],
    shopping: [
        { id: '1', name: 'Organic Avocado', quantity: 3, checked: false, category: 'Groceries' },
        { id: '2', name: 'Almond Milk', quantity: 1, checked: false, category: 'Groceries' }
    ]
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

const deleteDocument = async (collectionName, id) => {
    if (db) {
        await db.collection(collectionName).doc(id).delete();
    } else {
        memoryStore[collectionName] = memoryStore[collectionName].filter(item => item.id !== id);
    }
    return { success: true };
};

// --- Routes ---

// Transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await getCollection('transactions');
        // Sort by date desc
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(transactions);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/transactions', async (req, res) => {
    try {
        const newTransaction = await addDocument('transactions', req.body);
        res.json(newTransaction);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Shopping List
app.get('/api/shopping', async (req, res) => {
    try {
        const items = await getCollection('shopping');
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/shopping', async (req, res) => {
    try {
        const newItem = await addDocument('shopping', req.body);
        res.json(newItem);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.patch('/api/shopping/:id', async (req, res) => {
    try {
        const updated = await updateDocument('shopping', req.params.id, req.body);
        res.json(updated);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/shopping/clear-purchased', async (req, res) => {
    try {
        if (db) {
            const snapshot = await db.collection('shopping').where('checked', '==', true).get();
            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        } else {
            memoryStore.shopping = memoryStore.shopping.filter(i => !i.checked);
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});