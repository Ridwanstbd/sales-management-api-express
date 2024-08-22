const db = require('../config/connection')

exports.getAccounts = async () => {
    return await db.query("SELECT * FROM accounts")
}
exports.showAccount = async (account_code) => {
    return await db.query("SELECT * FROM accounts WHERE account_code = ?", [account_code])
}
exports.createAccount = async (data) => {
    const query = await db.query('INSERT INTO accounts SET ?', [data])
    if (!query.affectedRows) return { message: "Terjadi Kesalahan saat membuat Akun!" }
    return { message: "Akun berhasil dibuat!" }
}
exports.updateAccount = async (data, account_code) => {
    const query = await db.query('UPDATE accounts SET ? WHERE account_code = ?', [data, account_code])
    if (!query.affectedRows) return { message: "Terjadi Kesalahan saat memperbarui Akun!" }
    return { message: "Akun berhasil diperbarui!" }
}
exports.deleteAccount = async (account_code) => {
    const query = await db.query('DELETE FROM accounts WHERE account_code = ?', [account_code])
    if (!query.affectedRows) return { message: "Akun Gagal dihapus!" }
    return { message: "Akun berhasil dihapus!" }
}
exports.accountMovement = async (accountId) => {
    try {
        const [accountResult] = await db.query(`
            SELECT a.*, ay.normal_balance FROM accounts a JOIN account_types ay ON a.account_type_id = ay.id WHERE a.id = ?
        `, [accountId])
        const account = accountResult[0]

        const [journal_details] = await db.query(`SELECT jd.*, je.date AS journal_date, je.description AS journal_description FROM journal_details jd JOIN journal_entries je ON jd.journal_entry_id = je.id WHERE jd.account_id = ? ORDER BY jd.id ASC`, [accountId])

        const accountMovement = []
        for (const detail of journal_details) {
            const balance = await calculateBalance(accountId, detail.id, account.normal_balance)
            accountMovement.push({
                date: detail.account_date,
                description: detail.journal_description,
                debit: detail.debit,
                credit: detail.credit,
                balance: balance
            })
        }
        return {
            account_code: account.account_code,
            account_name: account.account_name,
            data: accountMovement
        }
    } catch (error) {
        return { message: 'tidak ada data pergerakan akun!', error }
    }
}
async function calculateBalance(accountId, journalDetailId, normalBalance) {
    const [details] = await db.query(`
        SELECT debit,credit FROM journal_details WHERE account_id = ? AND id <= ? ORDER BY id ASC
        `, [accountId, journalDetailId])
    let balance = 0
    for (const detail of details) {
        if (normalBalance === "Debet") {
            balance += detail.debit - detail.credit
        } else {
            balance += detail.credit - detail.debit
        }
    }
    return balance
}

exports.getAccountType = async () => {
    return await db.query('SELECT * FROM accounts_types')
}

exports.showAccountType = async (id) => {
    return await db.query('SELECT * FROM account_types WHERE id = ?', [id])
}

exports.createAccountType = async (data) => {
    const query = await db.query('INSERT INTO account_types SET ?', [data])
    if (!query.affectedRows) return { message: "Terjadi Kesalahan saat membuat Tipe Akun!" }
    return { message: "Tipe Akun berhasil dibuat!" }
}

exports.updateAccountType = async (data, id) => {
    const query = await db.query('UPDATE journal_entries SET ? WHERE id = ?', [data, id])
    if (!query.affectedRows) return { message: "Terjadi Kesalahan saat memperbarui Tipe Akun!" }
    return { message: "Tipe Akun berhasil diperbarui!" }
}

exports.deleteAccountType = async (id) => {
    const query = await db.query('DELETE FROM account_types WHERE id = ?', [id])
    if (!query.affectedRows) return { message: "Tipe Akun Gagal dihapus!" }
    return { message: "Tipe Akun berhasil dihapus!" }
}