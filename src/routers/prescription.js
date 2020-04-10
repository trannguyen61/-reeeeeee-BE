const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

//untouched

// patient
// get sets of 3 of received prescriptions
// req.body = 0
router.get('/prescription/:page', auth, (req, res) => {
    const query = 'SELECT * FROM prescriptions WHERE patient = ? LIMIT ?, 3'
    db.query(query, [req.id, req.params.page*3], (err, result) => {
        if (err) return res.status(400).send({ code: 400, err: 'Fetch data failed.' })
        
        res.status(200).send({ code: 200, forms: result })
    })
})

//doctor
// post prescription
// req.body = { things needed to make a prescription }
router.post('prescription', auth, (req, res) => {
    const payload = req.body
    const queryData = [payload.checkup_form, req.id, payload.diagnosis, payload.medicine, payload.dose, payload.re_exam_time]
    db.query('INSERT INTO prescriptions VALUES(?)', queryData, 
    (err, result) => {
        if (err) return res.status(400).send({ code: 400, err: 'Fetch data failed.' })

        res.status(200).send({ code: 200, forms: result })
    })
})