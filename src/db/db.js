const sql = require('mysql')

const connection = sql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

global.db = connection;

module.exports = connection