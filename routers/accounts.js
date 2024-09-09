const express = require('express')
const accounts = express.Router()
const { body, validationResult } = require('express-validator')
const { getAccounts, createAccount, updateAccount, deleteAccount, showAccount, accountMovement } = require('../controllers/accounts')

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: API untuk mengelola akun
 */

/**
 * @swagger
 * /v1/accounts/{business_id}:
 *   get:
 *     summary: Mendapatkan daftar semua akun berdasarkan ID bisnis
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: business_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID unik dari bisnis
 *     responses:
 *       200:
 *         description: Daftar akun berhasil didapatkan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 */
accounts.get('/:business_id', async (req, res) => {
    const { business_id } = req.params
    try {
        const result = await getAccounts(business_id)
        res.status(result.statusCode).json({
            statusCode: result.statusCode,
            message: result.message,
            data: result.data,
            error: result.error
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'Terjadi kesalahan pada server!',
            error: error.message
        });
    }
})

/**
 * @swagger
 * /v1/accounts/{business_id}/{id}:
 *   get:
 *     summary: Mendapatkan detail akun berdasarkan kode akun dan ID bisnis
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: business_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID unik dari bisnis
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Kode unik dari akun
 *     responses:
 *       200:
 *         description: Detail akun berhasil didapatkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 */
accounts.get('/:business_id/:id', async (req, res) => {
    const { business_id, id } = req.params
    try {
        const result = await showAccount(business_id, id)
        res.status(result.statusCode).json({
            statusCode: result.statusCode,
            message: result.message,
            data: result.data,
            error: result.error
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'Terjadi kesalahan pada server!',
            error: error.message
        });
    }
})

/**
 * @swagger
 * /v1/accounts:
 *   post:
 *     summary: Membuat akun baru
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       201:
 *         description: Akun berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 */
accounts.post('/', [
    body('account_code').notEmpty().withMessage('Account code dibutuhkan!'),
    body('account_name').notEmpty().withMessage('Account name dibutuhkan!'),
    body('account_type_id').isInt().withMessage('Account type ID harus Ada!'),
    body('initial_debit_balance').isNumeric().withMessage('Account balance harus numerik'),
    body('initial_credit_balance').isNumeric().withMessage('Account balance harus numerik'),
    body('business_id').isInt().withMessage('Business ID harus Ada!')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { account_code, account_name, account_type_id, initial_debit_balance, initial_credit_balance, business_id } = req.body
    const data = { account_code, account_name, account_type_id, initial_debit_balance, initial_credit_balance, business_id }
    try {
        const result = await createAccount(data)
        res.status(result.statusCode).json({
            statusCode: result.statusCode,
            message: result.message,
            error: result.error
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'Terjadi kesalahan pada server!',
            error: error.message
        });
    }
})

/**
 * @swagger
 * /v1/accounts/{business_id}/{id}:
 *   put:
 *     summary: Memperbarui akun berdasarkan kode akun dan ID bisnis
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: business_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID unik dari bisnis
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Kode unik dari akun yang akan diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       200:
 *         description: Akun berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 */
accounts.put('/:business_id/:id', async (req, res) => {
    const { account_name, account_type_id, initial_debit_balance, initial_credit_balance } = req.body
    const { business_id, id } = req.params
    const data = { account_name, account_type_id, initial_debit_balance, initial_credit_balance, business_id }
    try {
        const result = await updateAccount(data, business_id, id)
        res.status(result.statusCode).json({
            statusCode: result.statusCode,
            message: result.message,
            error: result.error
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'Terjadi kesalahan pada server!',
            error: error.message
        });
    }
})

/**
 * @swagger
 * /v1/accounts/{business_id}/{id}:
 *   put:
 *     summary: Memperbarui akun berdasarkan kode akun dan ID bisnis
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: business_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID unik dari bisnis
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Kode unik dari akun yang akan diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       200:
 *         description: Akun berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 */

/**
 * @swagger
 * /v1/accounts/{business_id}/{id}:
 *   delete:
 *     summary: Menghapus akun berdasarkan kode akun dan ID bisnis
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: business_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID unik dari bisnis
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Kode unik dari akun yang akan dihapus
 *     responses:
 *       200:
 *         description: Akun berhasil dihapus
 */
accounts.delete('/:business_id/:id', async (req, res) => {
    const { business_id, id } = req.params
    try {
        const result = await deleteAccount(business_id, id)
        res.status(result.statusCode).json({
            statusCode: result.statusCode,
            message: result.message,
            data: result.data,
            error: result.error
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'Terjadi kesalahan pada server!',
            error: error.message
        });
    }
})


/**
 * @swagger
 * /v1/accounts/movement/{business_id}/{account_id}:
 *   get:
 *     summary: Mendapatkan pergerakan akun berdasarkan ID akun dan ID bisnis
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: business_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID unik dari bisnis
 *       - in: path
 *         name: account_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID unik dari akun
 *     responses:
 *       200:
 *         description: Pergerakan akun berhasil didapatkan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AccountMovement'
 */
accounts.get('/movement/:business_id/:account_id', async (req, res) => {
    const { business_id, account_id } = req.params
    try {
        const result = await accountMovement(business_id, account_id);
        res.status(result.statusCode).json({
            statusCode: result.statusCode,
            message: result.message,
            data: result.data || null,
            error: result.error
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'Terjadi kesalahan pada server!',
            error: error.message
        });
    }

})

module.exports = accounts
