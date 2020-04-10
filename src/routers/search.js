const express = require('express')
const router = new express.Router()

// search 
// /api/search?search=clinic&data=this%is%clinic
router.post('', (req, res) => {
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
            table: 'patients',
            data: 'email'
        }
    }
    const query = `SELECT * FROM ${queryData[req.query.search].table} WHERE ${queryData[req.query.search].data} LIKE '%${decodeURIComponent(req.query.data)}%'`
    const a = db.query(query, (err, result) => {
        if (err) return res.status(400).send({ code: 400, err: 'Fetch data failed.' })

        res.status(200).send({ code: 200, result })
    })
    console.log(a.sql)
})

module.exports = router