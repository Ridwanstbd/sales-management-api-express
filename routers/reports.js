const express = require('express')
const reports = express.Router()
const { getFinalBalance, getReport } = require('../controllers/reports')

reports.get('/:accountId', async (req, res) => {
    const { accountId } = req.params
    res.send(await getReport(accountId))
})
reports.get('/final-balance/:accountId', async (req, res) => {
    const { accountId } = req.params
    res.send(await getFinalBalance(accountId))
})

module.exports = reports