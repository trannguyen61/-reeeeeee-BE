const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

// search 
// /api/search?search=clinic&data=this%is%clinic&page=1&num=2
router.post('/', auth, async (req, res) => {
    // console.log(req.query)
    // console.log(req.params)
    // console.log(req.url)
    const queryData = {
        clinic: {
            table: 'clinics',
            data: 'clinicName'
        },
        form: {
            table: 'checkupform',
            data: 'checkUpDate',
            optionalQuery: `AND patient = ${req.id}`
        },
        patient: {
            table: 'users',
            data: 'email',
            joinQuery: `JOIN patients ON patientID = userID`
        },
        prescription: {
            table: 'prescription',
            data: 'diagnosis',
            joinQuery: `JOIN checkUpForm ON prescription.checkUpForm = checkUpForm.formID`,
            optionalQuery: `AND patient = ${req.id}`
        }
    }
    let chosenData = queryData[req.query.search];

    let condition = `FROM ${chosenData.table} ${chosenData.joinQuery ? chosenData.joinQuery : ''} WHERE ${chosenData.data} LIKE '%${decodeURIComponent(req.query.data)}%' ${chosenData.optionalQuery ? chosenData.optionalQuery : ''}`

    let limitQuery = ` LIMIT ${req.query.page*req.query.num}, ${req.query.num}`
    
    try {
        const result = await db.query('SELECT * ' + condition + limitQuery)
        const sum = await db.query('SELECT COUNT(*) as SUM ' + condition)
        return res.status(200).send({ result, dataLength: sum[0].SUM })
    } catch(err) {
        console.log(err)
        return res.status(400).send({ message: 'Fetch data failed.' })
    }
})

router.get('/clinics', async (req, res) => {
    try {
        const result = await db.query(`SELECT clinicID, clinicName FROM clinics`)
        return res.status(200).send({ result })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ message: 'Fetch data failed.' })
    }
})

module.exports = router