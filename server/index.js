const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./lib/swagger');
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

// --- Documentation ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
console.log(`📄 Swagger Docs available at http://localhost:${PORT}/api-docs`);

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