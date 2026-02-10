const express = require('express');
const router = express.Router();
const { getCollection, addDocument, updateDocument, clearPurchasedItems } = require('../lib/db');

/**
 * @swagger
 * tags:
 *   name: Shopping
 *   description: Manage shopping list items
 */

/**
 * @swagger
 * /shopping:
 *   get:
 *     summary: Retrieve all shopping items
 *     tags: [Shopping]
 *     responses:
 *       200:
 *         description: A list of shopping items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShoppingItem'
 */
router.get('/', async (req, res) => {
    try {
        const items = await getCollection('shopping');
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @swagger
 * /shopping:
 *   post:
 *     summary: Add a new item to the shopping list
 *     tags: [Shopping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShoppingItem'
 *           example:
 *             name: "Milk"
 *             quantity: 2
 *             category: "Groceries"
 *             isPurchased: false
 *             addedBy: "Mom"
 *     responses:
 *       200:
 *         description: The added item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingItem'
 */
router.post('/', async (req, res) => {
    try {
        const newItem = await addDocument('shopping', req.body);
        res.json(newItem);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @swagger
 * /shopping/{id}:
 *   patch:
 *     summary: Update a shopping item (e.g., toggle status, change quantity)
 *     tags: [Shopping]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPurchased:
 *                 type: boolean
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The updated item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingItem'
 */
router.patch('/:id', async (req, res) => {
    try {
        const updated = await updateDocument('shopping', req.params.id, req.body);
        res.json(updated);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @swagger
 * /shopping/clear-purchased:
 *   delete:
 *     summary: Remove all items marked as purchased
 *     tags: [Shopping]
 *     responses:
 *       200:
 *         description: Result summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                   description: Number of items deleted
 */
router.delete('/clear-purchased', async (req, res) => {
    try {
        const result = await clearPurchasedItems();
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;