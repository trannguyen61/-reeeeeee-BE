const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

// chua lam pres search

// search 
// /api/search?search=clinic&data=this%is%clinic&page=1&num=2
router.post('', auth, (req, res) => {
    console.log(req.query)
    console.log(req.params)
    console.log(req.url)
    const queryData = {
        clinic: {
            table: 'clinics',
            data: 'clinicName'
        },
        form: {
            table: 'checkupform',
            data: 'checkUpDate'
        },
        patient: {
            table: 'users',
            data: 'email'
        },
        prescription: {
            table: 'prescription',
            data: 'diagnosis'
        }
    }
    let limitQuery = ` LIMIT ${req.query.page*req.query.num}, ${req.query.num}`
    let query = `FROM ${queryData[req.query.search].table} WHERE ${queryData[req.query.search].data} LIKE '%${decodeURIComponent(req.query.data)}%'`
    if (req.query.search === 'patient') query = `FROM ${queryData[req.query.search].table} JOIN patients ON patientID = userID WHERE ${queryData[req.query.search].data} LIKE '%${decodeURIComponent(req.query.data)}%'`
    else if (req.query.search === 'prescription') query = `FROM ${queryData[req.query.search].table} JOIN checkUpForm ON prescription.checkUpForm = checkUpForm.formID WHERE ${queryData[req.query.search].data} LIKE '%${decodeURIComponent(req.query.data)}%'`
    if (req.query.search === 'prescription' || req.query.search === 'form') query += ` AND patient = ${req.id}`

    const a = db.query('SELECT * ' + query + limitQuery, (err, result) => {
        if (err) return res.status(400).send({ message: 'Fetch data failed.' })
        console.log(result)

        db.query('SELECT COUNT(*) as SUM ' +query, (err, result2) => {
            if (err) return res.status(400).send({ message: 'Fetch data failed.' })
            console.log(result2[0].SUM)
            res.status(200).send({ result, dataLength: result2[0].SUM })
        })
    })
    console.log(a.sql)
})

router.get('/clinics', (req, res) => {
    const query = `SELECT clinicID, clinicName FROM clinics`
    db.query(query, (err, result) => {
        if (err) return res.status(400).send({ message: 'Fetch data failed.' })

        res.status(200).send({ result })
    })
})

module.exports = router