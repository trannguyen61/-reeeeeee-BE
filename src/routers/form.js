const express = require('express')
const router = new express.Router()

const auth = require('../middleware/auth')
const role = require('../middleware/role')

//doctor
// get all unresolved forms of doctor's clinic 
// req.body = 0
router.get('/form', auth, (req, res) => {
    // ? 1 query
    // SELECT * FROM forms WHERE clinic = 
    // ( SELECT clinic FROM doctor WHERE id = req.id )

    db.query('SELECT * FROM checkupform WHERE resolved = FALSE AND clinic = (SELECT clinic FROM doctors WHERE doctorID = ?)', req.id,
        (err, result) => {
            if (err) return res.status(400).send({ code: 400, err: 'Fetch data failed.' })

            res.status(200).send({ code: 200, forms: result })
        })

    // 2 query
    // db.query('SELECT clinic FROM doctor WHERE id = ?', req.id, (err, result) => {
    //     if (err) return res.status(400).send({ code: 400, err: 'Fetch data failed.' })

    //     db.query('SELECT * FROM forms WHERE clinic = ?', result[0].id, (err, result) => {
    //         if (err) return res.status(400).send({ code: 400, err: 'Fetch data failed.' })

    //         res.status(200).send({ code: 200, forms: result })
    //     })
    // })
})

// patient
// get sets of 3 of forms that patient made, up to date
// req.body = 0
router.get('/form/:page', auth, (req, res) => {
    const query = 'SELECT * FROM checkupform WHERE patient = ? LIMIT ?, 3 ORDER BY checkUpDate DESC'
    db.query(query, [req.id, req.params.page ? req.params.page * 3 : 0], (err, result) => {
        if (err) return res.status(400).send({ code: 400, err: 'Fetch data failed.' })

        res.status(200).send({ code: 200, forms: result })
    })
})

//patient
// post form
// req.body = { all things needed to make up a form, except for id and resolved values }
router.post('/form', auth, (req, res) => {
    const payload = req.body
    const queryData = [req.id, payload.clinic, payload.checkUpDate, payload.description]
    //resolved - default = false
    const query = 'INSERT INTO checkupform(patient, clinic, checkUpDate, description) VALUES(?)'
    db.query(query, queryData, (err, result) => {
        if (err) return res.status(400).send({ code: 400, err: 'Create form failed.' })

        res.status(200).send({ code: 200 })
    })
})

// doctor 
// accept form 
// req.body = { form.id, value }
router.patch('/form', auth, (req, res) => {
    db.query('UPDATE checkupform SET resolved = ? WHERE formID = ?', [req.body.value, req.body.formID], (err, result) => {
        if (err) return res.status(400).send({ code: 400, err: 'Update failed.' })

        res.status(200).send({ code: 200 })
    })
})