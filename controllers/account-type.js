const db = require('../config/connection')

exports.getAccountTypes = async () => {
    try {
        const result = await db.query('SELECT * FROM account_types')
        return result
    } catch (error) {
        return { message: "Error:", error }
    }
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