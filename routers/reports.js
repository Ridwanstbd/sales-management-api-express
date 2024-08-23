const express = require('express')
const reports = express.Router()
const { body, param, validationResult } = require('express-validator')
const { getJournalProfitAndLoss, getBalanceSheet } = require('../controllers/reports')

reports.get('/profit-loss/:accountCode', async (req, res) => {
    const { accountCode } = req.params
    res.send(await getJournalProfitAndLoss(accountCode))
})
reports.get('/balance-sheet/:accountCode', async (req, res) => {
    const { accountCode } = req.params
    res.send(await getBalanceSheet(accountCode))
})
module.exports = reports