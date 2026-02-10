const express = require('express');
const router = express.Router();
const { getCollection, addDocument } = require('../lib/db');

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Manage income and expenses
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Retrieve all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: A list of transactions sorted by date (descending)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
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

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *           example:
 *             title: "Grocery Run"
 *             amount: 45.50
 *             category: "Groceries"
 *             date: "2023-10-27T10:00:00Z"
 *             type: "expense"
 *             icon: "ShoppingBag"
 *             createdBy: "Dad"
 *     responses:
 *       200:
 *         description: The created transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 */
router.post('/', async (req, res) => {
    try {
        const newTransaction = await addDocument('transactions', req.body);
        res.json(newTransaction);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;