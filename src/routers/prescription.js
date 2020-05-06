const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

// patient
// get sets of 3 of received prescriptions
// req.body = 0
router.get('/prescription', auth, (req, res) => {
    console.log(req.url)
    const query = 'SELECT * FROM prescription JOIN checkUpForm ON prescription.checkUpForm= checkUpForm.formID WHERE patient = ? LIMIT ?, 2'
    db.query(query, [req.id, req.query.page*req.query.num], (err, result) => {
        if (err) {console.log(err); return res.status(400).send({ message: 'Fetch data failed.' })}

        db.query('SELECT COUNT(*) as SUM FROM prescription JOIN checkUpForm ON prescription.checkUpForm= checkUpForm.formID WHERE patient = ?', req.id, (err, result2) => {
            // console.log(result)
            res.status(200).send({ result, dataLength: result2[0].SUM })    
        })
    })
})

//doctor
// post prescription
// req.body = { things needed to make a prescription }
router.post('/prescription', auth, (req, res) => {
    const payload = req.body
    const queryData = [+payload.form, req.id, payload.diagnosis, payload.medicine, payload.dose, payload.time? payload.time : null]
    db.query('INSERT INTO prescription(checkUpForm, doctor, diagnosis, medicine, dose, reExaminationTime) VALUES(?)', [queryData], 
    (err, result) => {
        if (err) {
            console.log(err)
            return res.status(400).send({ message: 'Fetch data failed.' })
        }

        res.status(200)
    })
})

module.exports = router