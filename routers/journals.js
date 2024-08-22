const express = require('express')
const { body, param, validationResult } = require('express-validator')
const journals = express.Router()
const { getJournals, showJournalById, createJournal, updateJournalEntries, updateJournalDetailById, deleteJournal, deleteJournalDetailById, createJournalDetail } = require('../controllers/journals')

/**
 * @swagger
 * tags:
 *   name: Journals
 *   description: API untuk mengelola jurnal
 */

/**
 * @swagger
 * /journals:
 *   get:
 *     summary: Mendapatkan daftar semua jurnal
 *     tags: [Journals]
 *     responses:
 *       200:
 *         description: Daftar jurnal berhasil didapatkan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Journal'
 */
journals.get('/', async (req, res) => {
    res.send(await getJournals())
})

/**
 * @swagger
 * /journals/{id}:
 *   get:
 *     summary: Mendapatkan detail jurnal berdasarkan ID jurnal
 *     tags: [Journals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID unik dari jurnal
 *     responses:
 *       200:
 *         description: Detail jurnal berhasil didapatkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journal'
 */
journals.get('/:id', async (req, res) => {
    const { id } = req.params
    res.send(await showJournalById(id))
})

/**
 * @swagger
 * /journals:
 *   post:
 *     summary: Membuat jurnal baru
 *     tags: [Journals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Journal'
 *     responses:
 *       201:
 *         description: Jurnal berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journal'
 */
journals.post('/', [
    body('data.date').notEmpty().withMessage('Tanggal dibutuhkan!').isDate().withMessage('Tanggal harus berupa tanggal yang valid'),
    body('data.description').notEmpty().withMessage('Deskripsi dibutuhkan!'),

    body('details').isArray({ min: 1 }).withMessage('Detail harus berupa Array dan tidak boleh kosong !'),
    body('details.*.account_id').notEmpty().withMessage('Id Akun dibutuhkan!'),
    body('details.*.debit').notEmpty().withMessage('Debit dibutuhkan!').isNumeric().withMessage('Debit harus berupa Angka!'),
    body('details.*.credit').notEmpty().withMessage('Credit dibutuhkan!').isNumeric().withMessage('Kredit harus berupa Angka!')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { data, details } = req.body;
    res.send(await createJournal(data, details))
})

/**
 * @swagger
 * /journals/detail/{journalEntryId}:
 *   post:
 *     summary: Menambahkan detail pada entri jurnal yang sudah ada
 *     tags: [Journals]
 *     parameters:
 *       - in: path
 *         name: journalEntryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID dari entri jurnal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JournalDetail'
 *     responses:
 *       201:
 *         description: Detail jurnal berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalDetail'
 */
journals.post('/detail/:journalEntryId', [
    param('journalEntryId').isInt().withMessage('ID Entri Jurnal harus berupa bilangan bulat'),
    body('account_id').isInt().withMessage('ID akun harus berupa bilangan bulat'),
    body('debit').isNumeric({ gt: -1 }).withMessage('Debit harus berupa angka yang bukan negatif'),
    body('credit').isNumeric({ gt: -1 }).withMessage('Credit harus berupa angka yang bukan negatif')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { journalEntryId } = req.params
    const { account_id, debit, credit } = req.body
    const data = { account_id, debit, credit }
    res.send(await createJournalDetail(data, journalEntryId))
})

/**
 * @swagger
 * /journals/{journalId}:
 *   put:
 *     summary: Memperbarui entri jurnal berdasarkan ID jurnal
 *     tags: [Journals]
 *     parameters:
 *       - in: path
 *         name: journalId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID unik dari jurnal yang akan diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Journal'
 *     responses:
 *       200:
 *         description: Jurnal berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journal'
 */
journals.put('/:journalId', async (req, res) => {
    const { date, description } = req.body
    const { journalId } = req.params
    const data = { date, description }
    res.send(await updateJournalEntries(data, journalId))
})

/**
 * @swagger
 * /journals/{journalEntryId}/{journalDetailId}:
 *   put:
 *     summary: Memperbarui detail entri jurnal berdasarkan ID
 *     tags: [Journals]
 *     parameters:
 *       - in: path
 *         name: journalEntryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID dari entri jurnal
 *       - in: path
 *         name: journalDetailId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID dari detail entri jurnal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JournalDetail'
 *     responses:
 *       200:
 *         description: Detail entri jurnal berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalDetail'
 */
journals.put('/:journalEntryId/:journalDetailId', async (req, res) => {
    const { account_id, debit, credit } = req.body
    const { journalEntryId, journalDetailId } = req.params
    const data = { account_id, debit, credit }
    res.send(await updateJournalDetailById(data, journalEntryId, journalDetailId))
})

/**
 * @swagger
 * /journals/{journalId}:
 *   delete:
 *     summary: Menghapus entri jurnal berdasarkan ID jurnal
 *     tags: [Journals]
 *     parameters:
 *       - in: path
 *         name: journalId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID unik dari jurnal yang akan dihapus
 *     responses:
 *       200:
 *         description: Jurnal berhasil dihapus
 */
journals.delete('/:journalId', async (req, res) => {
    const { journalId } = req.params
    res.send(await deleteJournal(journalId))
})

/**
 * @swagger
 * /journals/{journalId}/{journalDetailId}:
 *   delete:
 *     summary: Menghapus detail entri jurnal berdasarkan ID
 *     tags: [Journals]
 *     parameters:
 *       - in: path
 *         name: journalId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID dari entri jurnal
 *       - in: path
 *         name: journalDetailId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID dari detail entri jurnal
 *     responses:
 *       200:
 *         description: Detail entri jurnal berhasil dihapus
 */
journals.delete('/:journalId/:journalDetailId', async (req, res) => {
    const { journalId, journalDetailId } = req.params
    res.send(await deleteJournalDetailById(journalId, journalDetailId))
})

module.exports = journals
