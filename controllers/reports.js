const db = require('../config/connection')

exports.getJournalProfitAndLoss = async (accountCode) => {
    return await db.query()
}
exports.getBalanceSheet = async (accountCode) => {
    return await db.query()
}