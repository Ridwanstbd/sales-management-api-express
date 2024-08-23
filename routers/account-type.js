const express = require('express')
const accountTypes = express.Router()
const { body, validationResult } = require('express-validator')
const { getAccountTypes, createAccountType, showAccountType, updateAccountType, deleteAccountType } = require('../controllers/account-type')

/**
 * @swagger
 * tags:
 *   name: Account Type
 *   description: API untuk mengelola tipe
 */

/**
 * @swagger
 * /account-types:
 *   get:
 *     summary: Mendapatkan daftar semua tipe akun
 *     tags: [Account Type]
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

accountTypes.get('/', async (req, res) => {
    res.send(await getAccountTypes())
})


/**
 * @swagger
 * /account-types/{id}:
 *   get:
 *     summary: Mendapatkan detail tipe akun berdasarkan ID
 *     tags: [Account Type]
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
accountTypes.get('/:id', async (req, res) => {
    const { id } = req.params
    res.send(await showAccountType(id))
})

/**
 * @swagger
 * /account-types:
 *   post:
 *     summary: Membuat tipe akun baru
 *     tags: [Account Type]
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
accountTypes.post('/', [
    body('name').notEmpty().withMessage('Nama tipe akun dibutuhkan!'),
    body('report_position').notEmpty().withMessage('Posisi laporan dibutuhkan!').isIn(['Neraca', 'Laba Rugi']).withMessage('Posisi laporan tidak valid!'),
    body('normal_balance').notEmpty().withMessage('Saldo Normal dibutuhkan!').isIn(['Debet', 'Kredit']).withMessage('Posisi laporan tidak valid!'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const data = req.body
    res.send(await createAccountType(data))
})

/**
 * @swagger
 * /account-types/{id}:
 *   put:
 *     summary: Memperbarui tipe akun berdasarkan ID
 *     tags: [Account Type]
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
accountTypes.put('/:id', async (req, res) => {
    const { data } = req.body
    const { id } = req.params
    res.send(await updateAccountType(data, id))
})

/**
 * @swagger
 * /account-types/{id}:
 *   delete:
 *     summary: Menghapus tipe akun berdasarkan ID
 *     tags: [Account Type]
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
accountTypes.delete('/:id', async (req, res) => {
    const { id } = req.params
    res.send(await deleteAccountType(id))
})

module.exports = accountTypes