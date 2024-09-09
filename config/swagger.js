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
                AccountType: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'ID dari tipe akun.' },
                        name: { type: 'string', description: 'Nama dari tipe akun.' },
                        report_position: {
                            type: 'string',
                            enum: ['Neraca', 'Laba Rugi'],
                            description: 'Posisi laporan terkait akun, bisa Neraca atau Laba Rugi.'
                        },
                        normal_balance: {
                            type: 'string',
                            enum: ['Debet', 'Kredit'],
                            description: 'Jenis saldo normal akun, bisa Debet atau Kredit.'
                        },
                    },
                    required: ['name', 'report_position', 'normal_balance'],
                },
                Account: {
                    type: 'object',
                    properties: {
                        account_code: { type: 'string', description: 'Kode unik untuk akun.' },
                        account_name: { type: 'string', description: 'Nama dari akun.' },
                        account_type_id: { type: 'integer', description: 'ID tipe akun.' },
                        intial_debit_balance: { type: 'number', format: 'double', description: 'Saldo Debit Awal dari akun.' },
                        intial_credit_balance: { type: 'number', format: 'double', description: 'Saldo Kredit Awal dari akun.' },
                        business_id: { type: 'integer', description: 'ID dari bisnis yang terkait.' },
                    },
                    required: ['account_code', 'account_name', 'account_type_id', 'business_id'],
                },
                AccountMovement: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'ID dari akun.' },
                        code: { type: 'string', description: 'Kode akun.' },
                        name: { type: 'string', description: 'Nama akun.' },
                        account_type_id: { type: 'integer', description: 'ID tipe akun.' },
                        intial_debit_balance: { type: 'number', format: 'double', description: 'Saldo Debit Awal dari akun.' },
                        intial_credit_balance: { type: 'number', format: 'double', description: 'Saldo Kredit Awal dari akun.' },
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
                                    debit: { type: 'number', format: 'double', description: 'Jumlah debit.' },
                                    credit: { type: 'number', format: 'double', description: 'Jumlah kredit.' },
                                    balance: { type: 'number', format: 'double', description: 'Saldo yang dihitung setelah transaksi.' },
                                },
                            },
                        },
                    },
                },
                Journal: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'ID dari entri jurnal.' },
                        date: { type: 'string', format: 'date', description: 'Tanggal dari entri jurnal.' },
                        description: { type: 'string', description: 'Deskripsi dari entri jurnal.' },
                        business_id: { type: 'integer', description: 'ID dari bisnis yang terkait.' },
                        journal_details: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'integer', description: 'ID dari detail jurnal.' },
                                    journal_entry_id: { type: 'integer', description: 'ID dari entri jurnal utama.' },
                                    account_id: { type: 'integer', description: 'ID dari akun yang terkait.' },
                                    debit: { type: 'number', format: 'double', description: 'Jumlah debit.' },
                                    credit: { type: 'number', format: 'double', description: 'Jumlah kredit.' },
                                },
                            },
                        },
                    },
                    required: ['date', 'description', 'business_id', 'journal_details'],
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
