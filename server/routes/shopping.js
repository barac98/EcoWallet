const express = require('express');
const router = express.Router();
const { getCollection, addDocument, updateDocument, clearPurchasedItems } = require('../lib/db');

// GET /api/shopping
router.get('/', async (req, res) => {
    try {
        const items = await getCollection('shopping');
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST /api/shopping
router.post('/', async (req, res) => {
    try {
        const newItem = await addDocument('shopping', req.body);
        res.json(newItem);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// PATCH /api/shopping/:id - Update Item (e.g. check off item, change qty)
router.patch('/:id', async (req, res) => {
    try {
        const updated = await updateDocument('shopping', req.params.id, req.body);
        res.json(updated);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// DELETE /api/shopping/clear-purchased - Clear Purchased Items
router.delete('/clear-purchased', async (req, res) => {
    try {
        const result = await clearPurchasedItems();
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;