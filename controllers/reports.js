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

exports.getLedger = async (accountId) => {
    const query = await db.query(`SELECT 
    je.date AS tanggal,
    a.account_name AS nama,
    a.account_code AS kode,
    je.description AS deskripsi,
    jd.debit AS debit,
    jd.credit AS credit,
    IFNULL(SUM(jd.debit - jd.credit) OVER (ORDER BY je.date, je.id), 0) AS saldo
    FROM 
        journal_details jd
    INNER JOIN 
        journal_entries je ON jd.journal_entry_id = je.id
    INNER JOIN 
        accounts a ON jd.account_id = a.id
    INNER JOIN 
        account_types aty ON a.account_type_id = aty.id
    WHERE 
        jd.account_id = ?
    ORDER BY 
    je.date, je.id;
`, [accountId])
    const result = {
        "account_name": query[0].nama,
        "account_code": query[0].kode,
        "details": query.map(detail => ({
            "date": detail.tanggal,
            "description": detail.description,
            "debit": detail.debit,
            "credit": detail.credit,
            "balance": detail.saldo,
        }))
    }
    return result
}
exports.getProfitLoss = async (startDate, endDate) => {
    if (new Date(endDate) <= new Date(startDate)) {
        throw new Error("Tanggal akhir harus lebih besar dari tanggal awal");
    }

    const pendapatan = await db.query(`
        SELECT 
            a.account_code, 
            a.account_name, 
            SUM(IFNULL(jd.credit, 0) - IFNULL(jd.debit, 0)) AS saldo
        FROM 
            accounts a
        JOIN 
            account_types aty ON a.account_type_id = aty.id
        LEFT JOIN 
            journal_details jd ON a.id = jd.account_id
        LEFT JOIN 
            journal_entries je ON jd.journal_entry_id = je.id
        WHERE 
            aty.name = 'Pendapatan'
            AND je.date BETWEEN ? AND ?
        GROUP BY 
            a.account_code, a.account_name;`,
        [startDate, endDate]
    );

    const totalPendapatan = {
        "detail": pendapatan.map(detail => ({
            "account_name": detail.account_name,
            "account_code": detail.account_code,
            "balance": detail.saldo,
        })),
        "total": pendapatan.reduce((acc, curr) => acc + curr.saldo, 0) // Menggunakan reduce untuk menghitung total saldo
    };

    const biayaAtasPendapatan = await db.query(`
        SELECT 
            a.account_code, 
            a.account_name, 
            SUM(IFNULL(jd.debit, 0) - IFNULL(jd.credit, 0)) AS saldo
        FROM 
            accounts a
        JOIN 
            account_types aty ON a.account_type_id = aty.id
        LEFT JOIN 
            journal_details jd ON a.id = jd.account_id
        LEFT JOIN 
            journal_entries je ON jd.journal_entry_id = je.id
        WHERE 
            aty.name = 'HPP'
            AND je.date BETWEEN ? AND ?
        GROUP BY 
            a.account_code, a.account_name;`,
        [startDate, endDate]
    );

    const totalBiayaAtasPendapatan = {
        "detail": biayaAtasPendapatan.map(detail => ({
            "account_name": detail.account_name,
            "account_code": detail.account_code,
            "balance": detail.saldo,
        })),
        "total": biayaAtasPendapatan.reduce((acc, curr) => acc + curr.saldo, 0) // Menggunakan reduce untuk menghitung total saldo
    };

    const biaya = await db.query(`
        SELECT 
            a.account_code, 
            a.account_name, 
            SUM(IFNULL(jd.debit, 0) - IFNULL(jd.credit, 0)) AS saldo
        FROM 
            accounts a
        JOIN 
            account_types at ON a.account_type_id = at.id
        LEFT JOIN 
            journal_details jd ON a.id = jd.account_id
        LEFT JOIN 
            journal_entries je ON jd.journal_entry_id = je.id
        WHERE 
            at.name = 'Beban Biaya'
            AND je.date BETWEEN ? AND ?
        GROUP BY 
            a.account_code, a.account_name;`,
        [startDate, endDate]
    );

    const totalBiaya = {
        "detail": biaya.map(detail => ({
            "account_name": detail.account_name,
            "account_code": detail.account_code,
            "balance": detail.saldo,
        })),
        "total": biaya.reduce((acc, curr) => acc + curr.saldo, 0) // Menggunakan reduce untuk menghitung total saldo
    };

    const pendapatanLainnya = await db.query(`
        SELECT 
            a.account_code, 
            a.account_name, 
            SUM(IFNULL(jd.credit, 0) - IFNULL(jd.debit, 0)) AS saldo
        FROM 
            accounts a
        JOIN 
            account_types at ON a.account_type_id = at.id
        LEFT JOIN 
            journal_details jd ON a.id = jd.account_id
        LEFT JOIN 
            journal_entries je ON jd.journal_entry_id = je.id
        WHERE 
            at.name = 'Pendapatan Lainnya'
            AND je.date BETWEEN ? AND ?
        GROUP BY 
            a.account_code, a.account_name;`,
        [startDate, endDate]
    );

    const totalPendapatanLainnya = {
        "detail": pendapatanLainnya.map(detail => ({
            "account_name": detail.account_name,
            "account_code": detail.account_code,
            "balance": detail.saldo,
        })),
        "total": pendapatanLainnya.reduce((acc, curr) => acc + curr.saldo, 0) // Menggunakan reduce untuk menghitung total saldo
    };

    const bebanBiayaLainnya = await db.query(`
        SELECT 
            a.account_code, 
            a.account_name, 
            SUM(IFNULL(jd.debit, 0) - IFNULL(jd.credit, 0)) AS saldo
        FROM 
            accounts a
        JOIN 
            account_types at ON a.account_type_id = at.id
        LEFT JOIN 
            journal_details jd ON a.id = jd.account_id
        LEFT JOIN 
            journal_entries je ON jd.journal_entry_id = je.id
        WHERE 
            at.name = 'Beban Biaya Lainnya'
            AND je.date BETWEEN ? AND ?
        GROUP BY 
            a.account_code, a.account_name;`,
        [startDate, endDate]
    );

    const totalBebanBiayaLainnya = {
        "detail": bebanBiayaLainnya.map(detail => ({
            "account_name": detail.account_name,
            "account_code": detail.account_code,
            "balance": detail.saldo,
        })),
        "total": bebanBiayaLainnya.reduce((acc, curr) => acc + curr.saldo, 0) // Menggunakan reduce untuk menghitung total saldo
    };

    const labaKotor = totalPendapatan.total - totalBiayaAtasPendapatan.total;
    const labaOperasional = labaKotor - totalBiaya.total;
    const totalPendapatanDanBiayaLain = totalPendapatanLainnya.total - totalBebanBiayaLainnya.total;
    const labaBersih = labaOperasional + totalPendapatanDanBiayaLain;

    const result = {
        "report_type": "Laba Rugi",
        "pendapatan": totalPendapatan,
        "biaya_atas_pendapatan": totalBiayaAtasPendapatan,
        "biaya": totalBiaya,
        "laba_kotor": labaKotor,
        "laba_operasional": labaOperasional,
        "pendapatan_lainnya": totalPendapatanLainnya,
        "beban_biaya_lainnya": totalBebanBiayaLainnya,
        "pendapatan_dan_biaya_lainnya": totalPendapatanDanBiayaLain,
        "laba_bersih": labaBersih
    };
    return result;
}
