const express = require('express');
const router = express.Router();
const { getDocument, setDocument } = require('../lib/db');

/**
 * @swagger
 * tags:
 *   name: Income
 *   description: Manage monthly budget/income
 */

/**
 * @swagger
 * /income/{id}:
 *   get:
 *     summary: Get income for a specific month (ID format YYYY-MM)
 *     tags: [Income]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Month ID (e.g., 2023-10)
 *     responses:
 *       200:
 *         description: Income data
 */
router.get('/:id', async (req, res) => {
    try {
        const data = await getDocument('incomes', req.params.id);
        res.json(data || { amount: 0 });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @swagger
 * /income/{id}:
 *   post:
 *     summary: Set income for a specific month
 *     tags: [Income]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated income
 */
router.post('/:id', async (req, res) => {
    try {
        const updated = await setDocument('incomes', req.params.id, req.body);
        res.json(updated);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;