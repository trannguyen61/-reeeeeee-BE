module.exports = {
    patient(req, res, next) {
        if (req.role === 'patient') next()
        else return res.status(401).send({ code: 401, err: "Authentication failed." })
    },

    doctor(req, res, next) {
        if (req.role === 'doctor') next()
        else return res.status(401).send({ code: 401, err: "Authentication failed." })
    }
}