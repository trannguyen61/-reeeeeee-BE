const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const role = require('../middleware/role')

// unused, = search. leave in case.
// patient
// get sets of 3 of received prescriptions
// req.body = 0
router.get('/prescription', auth, role.patient, async (req, res) => {
    console.log(req.url)
    const query = 'SELECT * FROM prescription JOIN checkUpForm ON prescription.checkUpForm= checkUpForm.formID WHERE patient = ? LIMIT ?, 2'

    try {
        const presResult = await db.query(query, [req.id, req.query.page*req.query.num])
        const sum = await db.query('SELECT COUNT(*) as SUM FROM prescription JOIN checkUpForm ON prescription.checkUpForm= checkUpForm.formID WHERE patient = ?', req.id)
        return res.status(200).send({ presResult, dataLength: sum[0].SUM }) 
    } catch(err) {
        console.log(err)
        return res.status(400).send({ message: 'Fetch data failed.' })
    }
})

//doctor
// post prescription
// req.body = { things needed to make a prescription }
router.post('/prescription', auth, role.doctor, async (req, res) => {
    const payload = req.body
    const queryData = [+payload.form, req.id, payload.diagnosis, payload.medicine, payload.dose, payload.time? payload.time : null]

    try {
        await db.query('INSERT INTO prescription(checkUpForm, doctor, diagnosis, medicine, dose, reExaminationTime) VALUES(?)', [queryData])
        return res.status(200).send({ message: "Successful!" })
    } catch(err) {
        console.log(err)
        return res.status(400).send({ message: 'Fetch data failed.' })
    }
})

module.exports = router