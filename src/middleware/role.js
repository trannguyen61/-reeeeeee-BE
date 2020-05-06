module.exports = {
    patient(req, res, next) {
        if (req.role === 'patient') next()
        else return res.status(401).send({ message: "Authentication failed." })
    },

    doctor(req, res, next) {
        if (req.role === 'doctor') next()
        else return res.status(401).send({ message: "Authentication failed." })
    }
}