const db = require('../config/connection')

exports.getJournals = async () => {
    return await db.query('SELECT * FROM journal_entries ORDER BY date DESC')
}
exports.showJournalById = async (journalId) => {
    try {
        const query = await db.query(
            `SELECT je.id, je.date, je.description, jd.id AS journal_detail_id, jd.account_id, jd.debit, jd.credit FROM journal_entries je INNER JOIN journal_details jd ON je.id = jd.journal_entry_id WHERE je.id = ?`, [journalId]);

        if (query.length === 0) {
            return { message: "Jurnal tidak ditemukan!" };
        }
        const journal = {
            id: query[0].journal_entry_id,
            date: query[0].date,
            description: query[0].description,
            details: query.map(detail => ({
                journal_detail_id: detail.journal_detail_id,
                account_id: detail.account_id,
                debit: detail.debit,
                credit: detail.credit,
            })),
        };
        return journal;
    } catch (error) {
        return { message: "Error retrieving journal by ID:", error }
    }
};

exports.createJournal = async (data, details) => {
    try {
        const query = await db.query('INSERT INTO journal_entries SET ?', [data])
        if (!query.affectedRows) return { message: "Terjadi Kesalahan saat membuat Journal Entry!" }

        const journalId = query[0].insertId
        for (const detail of details) {
            detail.journal_entry_id = journalId
            await db.query('INSERT INTO journal_details SET ?', [detail])
        }
        return { message: "Jurnal berhasil dibuat!" }
    } catch (error) {
        return { message: 'Error saat membuat journal entry:', error };
    }
}

exports.createJournalDetail = async (data, journalEntryId) => {
    try {
        const query = await db.query('INSERT INTO journal_details SET ? ,journal_entry_id = ?', [data, journalEntryId])
        if (!query.affectedRows) return { message: "Terjadi Kesalahan saat membuat Jurnal Detail!" }
        return { message: "Jurnal Detail berhasil dibuat!" }
    } catch (error) {
        return { message: "Error membuat jurnal ID:", error }
    }
}

exports.updateJournalEntries = async (data, journalEntryId) => {
    try {
        const query = await db.query('UPDATE journal_entries SET ? WHERE id = ?', [data, journalEntryId])
        if (!query.affectedRows) return { message: "Terjadi Kesalahan Saat memperbarui jurnal!" }
        return { message: "Jurnal berhasil diperbarui!" }
    } catch (error) {
        return { message: 'Error :', error }
    }
}

exports.updateJournalDetailById = async (data, journalEntryId, journalDetailId) => {
    try {
        const query = await db.query('UPDATE journal_details SET ? WHERE journal_entry_id = ? AND id = ?', [data, journalEntryId, journalDetailId])
        if (!query.affectedRows) return { message: "Terjadi Kesalahan saat memperbarui detail!" }
        return { message: "Detail jurnal berhasil diperbarui!" }
    } catch (error) {
        return { message: 'Error :', error }
    }
}
exports.deleteJournal = async (journalEntryId) => {
    try {
        const deleteDetails = await db.query('DELETE FROM journal_details WHERE journal_entry_id = ?', [journalEntryId])
        if (!deleteDetails.affectedRows) return { message: "Terjadi kesalahan saat menghapus detail!" }

        const deleteEntry = await db.query('DELETE FROM journal_entries WHERE id = ?', [journalEntryId])
        if (!deleteEntry.affectedRows) return { message: "Terjadi kesalahan saat menghapus jurnal!" }
        return { message: "Journal Entry dan semua detailnya berhasil dihapus!" }
    } catch (error) {
        return { message: 'Error :', error }
    }
}
exports.deleteJournalDetailById = async (journalId, journalDetailId) => {
    try {
        const query = await db.query('DELETE FROM journal_details WHERE journal_entry_id = ? AND id = ?', [journalId, journalDetailId])
        if (!query.affectedRows) return { message: "Terjadi kesalahan saat menghapus Detail" }
        return { message: "Detail jurnal berhasil dihapus!" }
    } catch (error) {
        return { message: "Error :", error }
    }
}