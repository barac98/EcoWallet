const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initFirebase } = require('./lib/db');
const transactionsRouter = require('./routes/transactions');
const shoppingRouter = require('./routes/shopping');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Database (Firebase or Memory)
initFirebase();

// --- Routes ---
app.use('/api/transactions', transactionsRouter);
app.use('/api/shopping', shoppingRouter);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});