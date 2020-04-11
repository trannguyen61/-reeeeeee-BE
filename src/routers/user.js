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
            return res.status(400).send({ code: 400, err: "Signup failed." })
        }
        else {
            db.query('INSERT INTO patients SET patientID = LAST_INSERT_ID()', (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send({ code: 400, err: "Signup failed." })
                }
                console.log('SUCCESS')
                const token = getToken(payload.email)
                return res.status(200).send({ code: 200, token, role: 'patient' })
            })

        }
    })
})

router.post('/login', (req, res) => {
    const payload = req.body
    const queryData = [payload.email, payload.userPassword]
    if (!payload.email || !payload.userPassword) return res.status(400).send({ code: 400, err: "Missing credentials." })

    const query = 'SELECT userID FROM users WHERE email = ? AND userPassword = ?'

    db.query(query, queryData, async (err, result) => {
        if (err || result.length !== 1) {
            console.log(err || 'LOGIN FAILED')
            return res.status(400).send({ code: 400, err: "Login failed." })
        }
        else {
            console.log(result)
            const token = getToken(payload.email)
            try {
                const role = await getRole(result[0].userID)

                // console.log(result[0].userID)
                console.log(role)
                res.status(200).send({ code: 200, token, role })
            } catch(err) {
                return res.status(401).send({code: 401, err})
            }
            
        }
    })
})

const getToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3h' })
}

const getRole = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM patients WHERE patientID = ?', id, (err, result) => {
            // console.log(result)
            if (err) reject('Role authentication failed')
            if (result.length !== 0) resolve('patient')
            else resolve('doctor')
        })
    })
}

module.exports = router