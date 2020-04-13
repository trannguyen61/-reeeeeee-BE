const sql = require('mysql')
const connection = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect((err) => {
    if (err) throw err
    console.log('Database is connected.')
})

global.db = connection

module.exports = connection