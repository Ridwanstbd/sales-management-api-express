const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sales Management API',
            version: '1.0.0',
            description: 'API untuk manajemen penjualan',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
            },
        ],
        components: {
            schemas: {
                Account: {
                    type: 'object',
                    properties: {
                        account_code: { type: 'string' },
                        account_name: { type: 'string' },
                        account_type_id: { type: 'string' },
                        account_balance: { type: 'number' },
                    },
                    required: ['account_code', 'account_name', 'account_type_id'],
                },
                AccountMovement: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        date: { type: 'string', format: 'date-time' },
                        description: { type: 'string' },
                        amount: { type: 'number' },
                        type: { type: 'string', enum: ['debit', 'credit'] },
                    },
                    required: ['id', 'date', 'amount', 'type'],
                },
            },
        },
    },
    apis: ['./routers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const restrictAccess = (req, res, next) => {
    const allowedIPs = ['127.0.0.1::1'];
    const clientIP = req.ip;

    if (allowedIPs.includes(clientIP)) {
        next();
    } else {
        res.status(403).json({ message: 'Akses ditolak' });
    }
};
module.exports = (app) => {
    app.use('/api-docs', restrictAccess, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
