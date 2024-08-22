const mysql = require('mysql')
const env = require('dotenv')
const util = require('util')

env.config()

const connection = mysql.createConnection({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})
connection.query = util.promisify(connection.query).bind(connection)
connection.connect((err) => {
    if (err) {
        throw new Error(`Error : ${err.message}`);
    }
})
module.exports = connection