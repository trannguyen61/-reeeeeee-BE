const sql = require('mysql')
const connection = sql.createConnection({
    host: process.env.SERVER_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'db_prj'
})

connection.connect((err) => {
    if (err) throw err
    console.log('Database is connected.')
})

global.db = connection

module.exports = connection