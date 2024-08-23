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
        `, [accountId]);
        const account = accountResult;

        const queryResults = await db.query(`
            SELECT je.id, je.date, je.description, jd.id AS journal_detail_id, jd.account_id, jd.debit, jd.credit FROM journal_entries je INNER JOIN journal_details jd ON je.id = jd.journal_entry_id WHERE jd.account_id = ?
        `, [accountId]);

        const details = await Promise.all(queryResults.map(async (detail) => {
            const balance = await calculateBalance(detail.account_id, detail.journal_detail_id, account.normal_balance);
            return {
                journal_id: detail.id,
                date: detail.date,
                journal_detail_id: detail.journal_detail_id,
                description: detail.description,
                account_id: detail.account_id,
                debit: detail.debit,
                credit: detail.credit,
                balance: balance
            };
        }));


        const accountMovement = {
            id: account.id,
            code: account.account_code,
            name: account.account_name,
            account_type_id: account.account_type_id,
            account_balance: account.account_balance,
            normal_balance: account.normal_balance,
            details: details
        };

        return accountMovement
    } catch (error) {
        console.log(error);
        return { message: 'Terjadi kesalahan saat mengambil data pergerakan akun!', error };
    }
};

async function calculateBalance(accountId, journalDetailId, normalBalance) {
    const details = await db.query(`
        SELECT debit, credit FROM journal_details 
        WHERE account_id = ? AND id <= ? 
        ORDER BY id ASC
    `, [accountId, journalDetailId]);
    let balance = 0;
    for (const detail of details) {
        if (normalBalance === "Debet") {
            balance += detail.debit - detail.credit;
        } else {
            balance += detail.credit - detail.debit;
        }
    }

    return await balance;
}

