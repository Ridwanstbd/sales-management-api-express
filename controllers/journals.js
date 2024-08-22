const db = require('../config/connection')

exports.getJournals = async () => {
    return await db.query('SELECT * FROM journal_entries ORDER BY date DESC')
}
exports.getJournalById = async (journalId) => {
    try {
        const [journalResult] = await db.query('SELECT * FROM journal_entries WHERE id = ?', [journalId])
        if (journalResult.length === 0) {
            return { message: "Jurnal tidak ditemukan" }
        }
        const journal = journalResult[0]
        const [journalDetails] = await db.query('SELECT * FROM journal_details WHERE journal_entry_id = ?', [journalId])

        return {
            ...journal,
            details: journalDetails
        }
    } catch (error) {
        return { message: 'Server error', error };
    }

}
exports.createJournal = async (data, details) => {
    try {
        const query = await db.query('INSERT INTO journal_entries SET ?', [data])
        if (!query.affectedRows) return { message: "Terjadi Kesalahan saat membuat Journal Entry!" }
        const journalId = query[0].insertId
        for (const detail of details) {
            detail.journal_entry_id = journalId
            await db.query('INSERT INTO journal_details SET ?'[detail])
        }
        return { message: "Jurnal berhasil dibuat!" }
    } catch (error) {
        throw new Error("Terjadi kesalahan Server! ", error)
    }
}