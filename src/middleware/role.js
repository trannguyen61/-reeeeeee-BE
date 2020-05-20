module.exports = {
    patient(req, res, next) {
        if (req.role === 'patient') next()
        else return res.status(401).send({ message: "You don't have the authencity to access this data." })
    },

    doctor(req, res, next) {
        if (req.role === 'doctor') next()
        else return res.status(401).send({ message: "You don't have the authencity to access this data." })
    }
}