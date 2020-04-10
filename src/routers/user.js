const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')

const auth = require('../middleware/auth')

//changes in db variables name
//also need to change this in frontend

router.post('/signup', (req, res) => {
    const payload = req.body
    const queryData = [payload.email, payload.userName, payload.phoneNumber, payload.userPassword, payload.dateOfBirth, payload.idCardSerial]
    if (!payload.email || !payload.userName || !payload.phoneNumber || !payload.userPassword) return res.status(400).send({ code: 400, err: "Missing credentials." })

    const query = 'INSERT INTO `users` (email, userName, phoneNumber, userPassword, dateOfBirth, idCardSerial) VALUES (?)'
    db.query(query, [queryData], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(400).send({ code: 400, err: "Signup failed." })}
        else {
            console.log('SUCCESS')
            const token = getToken(payload.email)
            // console.log(token)
            res.status(200).send({ code: 200, token, role: req.role })
        }
    })
})

router.post('/login', (req, res) => {
    const payload = req.body
    const queryData = [payload.email, payload.userPassword]
    if (!payload.email || !payload.userPassword) return res.status(400).send({ code: 400, err: "Missing credentials." })

    const query = 'SELECT userID FROM users WHERE email = ? AND userPassword = ?'

    db.query(query, queryData, (err, result) => {
        if (err || result.length !== 1) return res.status(400).send({ code: 400, err: "Login failed." })
        else {
            console.log(result)
            const token = getToken(payload.email)
            res.status(200).send({ code: 200, token, role: req.role })
        }
    })
})

const getToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3h' })
}

module.exports = router