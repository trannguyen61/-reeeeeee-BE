const jwt = require('jsonwebtoken')

module.exports = async function auth(req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decodedObj = jwt.verify(token, process.env.JWT_SECRET)

        const queryData = [decodedObj.email]

        const userResult = await db.query('SELECT userID AS id FROM users WHERE email = ?', queryData)
        const patientResult = await db.query('SELECT * FROM patients WHERE patientID = ?', userResult[0].id)
        if (patientResult.length !== 0) req.role = 'patient'
        else req.role = 'doctor'
        req.token = token
        req.id = userResult[0].id
        next()
    } catch(err) {
        console.log(err)
        res.status(401).send({ message: "Authentication failed." })
    }
}