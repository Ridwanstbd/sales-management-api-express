const express = require('express')
const reports = express.Router()
const { getFinalBalance, getReport, getLedger, getProfitLoss } = require('../controllers/reports')

reports.get('/:accountId', async (req, res) => {
    const { accountId } = req.params
    res.send(await getReport(accountId))
})
reports.get('/saldo-akhir/:accountId', async (req, res) => {
    const { accountId } = req.params
    res.send(await getFinalBalance(accountId))
})
reports.get('/buku-besar/:accountId', async (req, res) => {
    const { accountId } = req.params
    res.send(await getLedger(accountId))
})
reports.get('/laba-rugi/:startDate/:endDate', async (req, res) => {
    const { startDate, endDate } = req.params
    res.send(await getProfitLoss(startDate, endDate))
})

module.exports = reports