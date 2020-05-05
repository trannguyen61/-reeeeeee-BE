const jwt = require('jsonwebtoken')

module.exports = function auth(req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decodedObj = jwt.verify(token, process.env.JWT_SECRET)

        const queryData = [decodedObj.email]
        const query = 'SELECT userID AS id FROM users WHERE email = ?'
        db.query(query, queryData, (err, result) => {
            if (err) throw err
            //type of res: [ RowDataPacket { id: 4 } ]
            console.log(result[0].id)

            // uncomment this after finishing user's features
            db.query('SELECT * FROM patients WHERE patientID = ?', result[0].id, (err, result) => {
                if (result.length !== 0) req.role = 'patient'
                else req.role = 'doctor'
            })
            req.token = token
            req.id = result[0].id
            next()
        })
    } catch(err) {
        console.log(err)
        res.status(401).send({ code: 401, err: "Authentication failed." })
    }
}