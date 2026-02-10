const swaggerJsdoc = require('swagger-jsdoc');

// Dynamic Server URL: Use Render's external URL if available, otherwise localhost
const serverUrl = process.env.RENDER_EXTERNAL_URL 
  ? `${process.env.RENDER_EXTERNAL_URL}/api` 
  : 'http://localhost:3001/api';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EcoWallet API',
      version: '1.0.0',
      description: 'API documentation for the EcoWallet Budget & Shopping Application',
    },
    servers: [
      {
        url: serverUrl,
        description: process.env.RENDER_EXTERNAL_URL ? 'Production Server' : 'Local Development Server',
      },
    ],
    components: {
      schemas: {
        Transaction: {
          type: 'object',
          required: ['title', 'amount', 'type', 'date'],
          properties: {
            id: { type: 'string', description: 'Auto-generated ID' },
            title: { type: 'string', description: 'Description of the transaction' },
            amount: { type: 'number', description: 'Monetary value' },
            category: { type: 'string', description: 'Category name (e.g. Food, Transport)' },
            date: { type: 'string', format: 'date-time', description: 'ISO 8601 date string' },
            type: { type: 'string', enum: ['income', 'expense'] },
            icon: { type: 'string', description: 'Lucide icon name' },
            createdBy: { type: 'string', description: 'Name of the user who created it' },
          },
        },
        ShoppingItem: {
          type: 'object',
          required: ['name'],
          properties: {
            id: { type: 'string', description: 'Auto-generated ID' },
            name: { type: 'string' },
            quantity: { type: 'integer', default: 1 },
            category: { type: 'string' },
            isPurchased: { type: 'boolean', default: false },
            addedBy: { type: 'string' },
          },
        },
      },
    },
  },
  // Paths to files containing OpenAPI definitions (relative to where node is executed)
  apis: ['./routes/*.js'], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;