const db = require('../config/connection')

exports.getFinalBalance = async (accountId) => {
    const [account] = await db.query(`
        SELECT a.*, ay.normal_balance FROM accounts a JOIN account_types ay ON a.account_type_id = ay.id WHERE a.id = ?
    `, [accountId])
    const movements = await db.query(`
        SELECT debit, credit FROM journal_details 
        WHERE account_id = ?
    `, [accountId]);
    let move = 0;
    for (const movement of movements) {
        if (account.normal_balance === "Debet") {
            move += movement.debit - movement.credit;
        } else if (account.normal_balance === "Kredit") {
            move += movement.credit - movement.debit;
        }
    }
    const [totalCredit] = await db.query(`SELECT SUM(credit) AS credit FROM journal_details WHERE account_id = ?`, [accountId])
    const [totalDebit] = await db.query(`SELECT SUM(debit) AS debit FROM journal_details WHERE account_id = ?`, [accountId])
    let final = 0
    if (account.normal_balance === "Debet") {
        // jika Debet: saldoDebitAwal + move - saldoKreditAwal - totalKredit
        final = {
            "normal_balance": account.normal_balance,
            "result": account.initial_debit_balance + move - account.initial_credit_balance - totalCredit.credit
        }
    } else if (account.normal_balance === "Kredit") {
        // jika Kredit: saldoKreditAwal + move - saldoDebitAwal - totalDebit
        final = {
            "normal_balance": account.normal_balance,
            "result": account.initial_credit_balance + move - account.initial_debit_balance - totalDebit.debit
        }
    }

    return final
}
exports.getReport = async (accountId) => {
    const [account] = await db.query(`
        SELECT a.*, ay.* FROM accounts a JOIN account_types ay ON a.account_type_id = ay.id WHERE a.id = ?
    `, [accountId])
    const movements = await db.query(`
        SELECT debit, credit FROM journal_details 
        WHERE account_id = ?
    `, [accountId]);
    let move = 0;
    for (const movement of movements) {
        if (account.normal_balance === "Debet") {
            move += movement.debit - movement.credit;
        } else if (account.normal_balance === "Kredit") {
            move += movement.credit - movement.debit;
        }
    }
    const [totalCredit] = await db.query(`SELECT SUM(credit) AS credit FROM journal_details WHERE account_id = ?`, [accountId])
    const [totalDebit] = await db.query(`SELECT SUM(debit) AS debit FROM journal_details WHERE account_id = ?`, [accountId])
    let final = 0
    if (account.report_position === "Neraca") {
        // jika Debet: saldoDebitAwal + move - saldoKreditAwal - totalKredit
        final = {
            "report_type": account.report_position,
            "result": account.initial_debit_balance + move - account.initial_credit_balance - totalCredit.credit
        }
    } else if (account.report_position === "Laba Rugi") {
        // jika Kredit: saldoKreditAwal + move - saldoDebitAwal - totalDebit
        final = {
            "report_type": account.report_position,
            "result": account.initial_credit_balance + move - account.initial_debit_balance - totalDebit.debit
        }
    }

    return final
}

exports.getBalanceSheet = async (accountCode) => {
    return await db.query()
}