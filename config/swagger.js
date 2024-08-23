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
                        account_code: { type: 'string', description: 'Kode unik untuk akun.' },
                        account_name: { type: 'string', description: 'Nama dari akun.' },
                        account_type_id: { type: 'integer', description: 'ID tipe akun.' },
                        account_balance: { type: 'number', format: 'float', description: 'Saldo saat ini dari akun.' },
                    },
                    required: ['account_code', 'account_name', 'account_type_id'],
                },
                AccountMovement: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'ID dari akun.' },
                        code: { type: 'string', description: 'Kode akun.' },
                        name: { type: 'string', description: 'Nama akun.' },
                        account_type_id: { type: 'integer', description: 'ID tipe akun.' },
                        account_balance: { type: 'number', format: 'float', description: 'Saldo saat ini dari akun.' },
                        normal_balance: { type: 'string', description: 'Jenis saldo normal dari akun.' },
                        details: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    journal_id: { type: 'integer', description: 'ID dari entri jurnal.' },
                                    date: { type: 'string', format: 'date-time', description: 'Tanggal dari entri jurnal.' },
                                    journal_detail_id: { type: 'integer', description: 'ID dari detail entri jurnal.' },
                                    description: { type: 'string', description: 'Deskripsi dari entri jurnal.' },
                                    account_id: { type: 'integer', description: 'ID dari akun.' },
                                    debit: { type: 'number', format: 'float', description: 'Jumlah debit.' },
                                    credit: { type: 'number', format: 'float', description: 'Jumlah kredit.' },
                                    balance: { type: 'number', format: 'float', description: 'Saldo yang dihitung setelah transaksi.' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: ['./routers/*.js'],
};


const swaggerSpec = swaggerJsdoc(options)

const restrictAccess = (req, res, next) => {
    const allowedIPs = ['::1'];
    const clientIP = req.ip;

    if (allowedIPs.includes(clientIP)) {
        next();
    } else {
        res.status(403).json({ message: 'Akses ditolak' });
    }
}
module.exports = (app) => {
    app.use('/api-docs', restrictAccess, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
