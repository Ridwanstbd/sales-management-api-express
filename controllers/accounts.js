const db = require('../config/connection')

exports.getAccounts = async (business_id) => {
    try {
        const result = await db.query("SELECT * FROM accounts WHERE business_id = ?", [business_id])
        if (!result || result.length === 0) {
            return {
                statusCode: 404,
                message: "Daftar Akun tidak ditemukan!",
                data: null
            };
        }
        return {
            statusCode: 200,
            message: "Daftar Akun berhasil ditemukan!",
            data: result
        }
    } catch (error) {
        return {
            statusCode: 500,
            message: "Terjadi kesalahan saat menghapus akun!",
            error: error.message
        }
    }
}
exports.showAccount = async (business_id, id) => {
    try {
        const result = await db.query("SELECT * FROM accounts WHERE business_id = ? AND id = ?", [business_id, id])
        if (!result || result.length === 0) {
            return {
                statusCode: 404,
                message: "Akun tidak ditemukan!",
                data: null
            };
        }
        return {
            statusCode: 200,
            message: "Akun Berhasil ditemukan!",
            data: result
        }
    } catch (error) {
        return {
            statusCode: 500,
            message: "Terjadi kesalahan saat menghapus akun!",
            error: error.message
        };
    }
}
exports.createAccount = async (data) => {
    const query = await db.query('INSERT INTO accounts SET ?', [data])
    if (!query.affectedRows) return {
        statusCode: 400,
        message: "Terjadi Kesalahan saat membuat Akun!"
    }
    return {
        statusCode: 201,
        message: "Akun berhasil dibuat!"
    }
}
exports.updateAccount = async (data, business_id, id) => {
    const query = await db.query('UPDATE accounts SET ? WHERE business_id = ? AND id = ?', [data, business_id, id])
    if (!query.affectedRows) return {
        statusCode: 500,
        message: "Terjadi Kesalahan saat memperbarui Akun!"
    }
    return {
        statusCode: 200,
        message: "Akun berhasil diperbarui!"
    }
}
exports.deleteAccount = async (business_id, id) => {
    try {
        const query = await db.query('DELETE FROM accounts WHERE business_id = ? AND id = ?', [business_id, id])
        if (!query.affectedRows) return {
            statusCode: 404,
            message: "Akun tidak ditemukan!"
        }

        return {
            statusCode: 200,
            message: "Akun berhasil dihapus!"
        }
    } catch (error) {
        return {
            statusCode: 500,
            message: "Terjadi kesalahan saat menghapus akun!",
            error: error.message
        };
    }
}

exports.accountMovement = async (businessId, accountId) => {
    try {
        const [accountResult] = await db.query(`
            SELECT a.*, ay.normal_balance FROM accounts a JOIN account_types ay ON a.account_type_id = ay.id WHERE a.business_id = ? AND a.id = ?
        `, [businessId, accountId])

        if (accountResult.length === 0) {
            return {
                statusCode: 404,
                message: 'Akun tidak ditemukan untuk bisnis yang diberikan!',
                data: null
            };
        }

        const account = accountResult

        const queryResults = await db.query(`
            SELECT je.id, je.date, je.description, jd.id AS journal_detail_id, jd.account_id, jd.debit, jd.credit 
            FROM journal_entries je 
            INNER JOIN journal_details jd ON je.id = jd.journal_entry_id 
            WHERE jd.account_id = ? AND je.business_id = ?
            ORDER BY jd.id ASC
        `, [accountId, businessId]);

        if (queryResults.length === 0) {
            return {
                statusCode: 404,
                message: 'Tidak ada pergerakan jurnal untuk akun ini!',
                data: null
            };
        }

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
            business_id: account.business_id,
            id: account.id,
            code: account.account_code,
            name: account.account_name,
            account_type_id: account.account_type_id,
            initial_debit_balance: account.initial_debit_balance,
            initial_credit_balance: account.initial_credit_balance,
            normal_balance: account.normal_balance,
            details: details
        };

        return {
            statusCode: 200,
            message: 'Data pergerakan akun berhasil diambil.',
            data: accountMovement
        };

    } catch (error) {
        return {
            statusCode: 500,
            message: 'Terjadi kesalahan saat mengambil data pergerakan akun!',
            error: error.message
        };
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

