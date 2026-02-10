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

// CORS Configuration
// Allows all origins by default or restricts to FRONTEND_URL if provided in env
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());

// Initialize Database (Firebase or Memory)
initFirebase();

// --- Documentation ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
console.log(`📄 Swagger Docs available at http://localhost:${PORT}/api-docs`);

// --- Routes ---
// These are properly namespaced with /api
app.use('/api/transactions', transactionsRouter);
app.use('/api/shopping', shoppingRouter);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});