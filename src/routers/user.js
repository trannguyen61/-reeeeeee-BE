const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')

router.post('/signup', async (req, res) => {
    const payload = req.body
    if (!payload.email || !payload.userName || !payload.phoneNumber || !payload.userPassword) 
        return res.status(400).send({ message: "Missing credentials." })
    const queryData = [payload.email, payload.userName, payload.phoneNumber, payload.userPassword, payload.dateOfBirth, payload.idCardSerial]

    const query = 'INSERT INTO `users` (email, userName, phoneNumber, userPassword, dateOfBirth, idCardSerial) VALUES (?)'

    try {
        const userResult = await db.query(query, [queryData])
        await db.query('INSERT INTO patients SET patientID = ?', userResult.insertId)
        const token = getToken(payload.email)
        return res.status(200).send({ token, role: 'patient' })
    } catch(err) {
        console.log(err)
        return res.status(400).send({ message: "Signup failed." })
    }
})

router.post('/login', async (req, res) => {
    const payload = req.body
    if (!payload.email || !payload.userPassword) return res.status(400).send({ code: 400, err: "Missing credentials." })

    const queryData = [payload.email, payload.userPassword]

    const query = 'SELECT userID FROM users WHERE email = ? AND userPassword = ?'

    try {
        const result = await db.query(query, queryData)
        const token = getToken(payload.email)
        const role = await getRole(result[0].userID)
        return res.status(200).send({ token, role })    
    } catch(e) {
        console.log(e)
        return res.status(400).send({ message: "Wrong credential(s)." })
    }
})

const getToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

const getRole = (id) => {
    return db.query('SELECT * FROM patients WHERE patientID = ?', id)
    .then(res => {
        if (res.length !== 0) return 'patient'
        else return 'doctor'
    })
    .catch(e => {throw new Error('Role authentication failed')})
}

module.exports = router