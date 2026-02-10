const express = require('express');
const router = express.Router();
const { getCollection, addDocument } = require('../lib/db');

// GET /api/transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await getCollection('transactions');
        // Sort by date desc
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(transactions);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST /api/transactions
router.post('/', async (req, res) => {
    try {
        const newTransaction = await addDocument('transactions', req.body);
        res.json(newTransaction);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;