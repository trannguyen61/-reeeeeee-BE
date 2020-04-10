const express = require('express')
const cors = require('cors')
require('dotenv').config()

const db = require('./db/db')

const app = express()
const port = process.env.SERVER_PORT || 3000

const userRoutes = require('./routers/user')
const searchRoutes = require('./routers/search')

app.use(cors())
app.options('*', cors())
app.use(express.json())

app.use('/api/search', searchRoutes)
app.use('/api', userRoutes)

app.listen(port, () => {
    console.log('Node server is running on port 3000.')
})