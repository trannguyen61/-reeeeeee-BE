const express = require('express')
const router = new express.Router()

const auth = require('../middleware/auth')
const role = require('../middleware/role')

//doctor
// get all unresolved forms of doctor's clinic 
// req.body = 0
router.get('/form', auth, role.doctor, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM checkupform WHERE resolved is null AND clinic = (SELECT clinic FROM doctors WHERE doctorID = ?)', req.id)
        res.status(200).send({ code: 200, forms: result })
    } catch(err) {
        console.log(err)
        return res.status(400).send({ message: 'Fetch data failed.' })
    }
})

// patient
// get sets of 2 of forms that patient made, up to date
// req.body = 0
router.get('/form/:page', auth, role.patient, async (req, res) => {
    const query = 'SELECT * FROM checkupform WHERE patient = ? ORDER BY checkUpDate DESC LIMIT ?, 2'

    try {
        const result = await db.query(query, [req.id, req.params.page * 2])
        return res.status(200).send({ forms: result })
    } catch(err) {
        console.log(err)
        return res.status(400).send({ message: 'Fetch data failed.' })
    }
})

//patient
// post form
// req.body = { all things needed to make up a form, except for id and resolved values }
router.post('/form', auth, role.patient, async (req, res) => {
    const payload = req.body
    const checkUpDate = payload.checkUpDate ? payload.checkUpDate.replace('T', ' ').concat(':00') : payload.checkUpDate
    const queryData = [req.id, +payload.clinic, checkUpDate, payload.description]
    
    const query = 'INSERT INTO checkupform(patient, clinic, checkUpDate, description) VALUES(?)'

    try {
        await db.query(query, [queryData])
        return res.status(200).send({ message: 'Successful!' })
    } catch(err) {
        console.log(err)
        return res.status(400).send({ message: 'Create form failed.' })
    }
})

// doctor 
// accept form 
// req.body = { form.id, value }
router.patch('/form', auth, role.doctor, async (req, res) => {
    try {
        await db.query('UPDATE checkupform SET resolved = ? WHERE formID = ?', [req.body.value, req.body.formID])
        return res.status(200).send({ message: 'Successful!' })
    } catch(err) {
        console.log(err)
        return res.status(400).send({ message: 'Update failed.' })
    }
})

module.exports = router