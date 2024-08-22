const express = require('express')
const accounts = express.Router()
const { body, validationResult } = require('express-validator')
const { getAccounts, createAccount, updateAccount, deleteAccount, showAccount, accountMovement, getAccountType, showAccountType, updateAccountType, createAccountType, deleteAccountType } = require('../controllers/accounts')

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: API untuk mengelola akun
 */

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Mendapatkan daftar semua akun
 *     tags: [Accounts]
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
accounts.get('/', async (req, res) => {
    res.send(await getAccounts())
})

/**
 * @swagger
 * /accounts/{account_code}:
 *   get:
 *     summary: Mendapatkan detail akun berdasarkan kode akun
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: account_code
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
accounts.get('/:account_code', async (req, res) => {
    const { account_code } = req.params
    res.send(await showAccount(account_code))
})

/**
 * @swagger
 * /accounts:
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
    body('account_balance').isNumeric().withMessage('Account balance harus numerik')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { account_code, account_name, account_type_id, account_balance } = req.body
    const data = { account_code, account_name, account_type_id, account_balance }
    res.send(await createAccount(data))
})

/**
 * @swagger
 * /accounts/{account_code}:
 *   put:
 *     summary: Memperbarui akun berdasarkan kode akun
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: account_code
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
accounts.put('/:account_code', async (req, res) => {
    const { account_name, account_type_id, account_balance } = req.body
    const { account_code } = req.params
    const data = { account_name, account_type_id, account_balance }
    res.send(await updateAccount(data, account_code))
})

/**
 * @swagger
 * /accounts/{account_code}:
 *   delete:
 *     summary: Menghapus akun berdasarkan kode akun
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: account_code
 *         schema:
 *           type: string
 *         required: true
 *         description: Kode unik dari akun yang akan dihapus
 *     responses:
 *       200:
 *         description: Akun berhasil dihapus
 */
accounts.delete('/:account_code', async (req, res) => {
    const { account_code } = req.params
    res.send(await deleteAccount(account_code))
})

/**
 * @swagger
 * /accounts/movement/{id}:
 *   get:
 *     summary: Mendapatkan pergerakan akun berdasarkan ID akun
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
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
accounts.get('/movement/:account_id', async (req, res) => {
    const { account_id } = req.params
    res.send(await accountMovement(account_id))
})

/**
 * @swagger
 * /accounts/types:
 *   get:
 *     summary: Mendapatkan daftar semua tipe akun
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: Daftar tipe akun berhasil didapatkan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AccountType'
 */
accounts.get('/types', async (req, res) => {
    res.send(await getAccountType())
})

/**
 * @swagger
 * /accounts/type/{id}:
 *   get:
 *     summary: Mendapatkan detail tipe akun berdasarkan ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID unik dari tipe akun
 *     responses:
 *       200:
 *         description: Detail tipe akun berhasil didapatkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountType'
 */
accounts.get('/type/:id', async (req, res) => {
    const { id } = req.params
    res.send(await showAccountType(id))
})

/**
 * @swagger
 * /accounts/types:
 *   post:
 *     summary: Membuat tipe akun baru
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountType'
 *     responses:
 *       201:
 *         description: Tipe akun berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountType'
 */
accounts.post('/types', [
    body('name').notEmpty().withMessage('Name dibutuhkan'),
    body('report_position').isIn(['Neraca', 'Laba Rugi']).withMessage('Report position harus "Neraca" atau "Laba Rugi"'),
    body('normal_balance').isIn(['Debet', 'Kredit']).withMessage('Normal balance harus "Debet" atau "Kredit"')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, report_position, normal_balance } = req.body
    const data = { name, report_position, normal_balance }
    res.send(await createAccountType(data))
})

/**
 * @swagger
 * /accounts/type/{id}:
 *   put:
 *     summary: Memperbarui tipe akun berdasarkan ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID unik dari tipe akun yang akan diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountType'
 *     responses:
 *       200:
 *         description: Tipe akun berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountType'
 */
accounts.put('/type/:id', async (req, res) => {
    const { id } = req.params
    const data = req.body
    res.send(await updateAccountType(data, id))
})

/**
 * @swagger
 * /accounts/type/{id}:
 *   delete:
 *     summary: Menghapus tipe akun berdasarkan ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID unik dari tipe akun yang akan dihapus
 *     responses:
 *       200:
 *         description: Tipe akun berhasil dihapus
 */
accounts.delete('/type/:id', async (req, res) => {
    const { id } = req.params
    res.send(await deleteAccountType(id))
})

module.exports = accounts
