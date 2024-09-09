const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const swaggerConfig = require('./config/swagger')
const app = express()
const port = 3000

const accounts = require('./routers/accounts')
const journals = require('./routers/journals')
const accountTypes = require('./routers/account-type')
const reports = require('./routers/reports')

app.use(cors())
app.use(bodyParser.json())
swaggerConfig(app);
app.get('/', (req, res) => {
    res.send('Hello hAHAHAHAHICI')
})
app.use('/api/v1/accounts', accounts)
app.use('/api/v1/journals', journals)
app.use('/api/v1/account-types', accountTypes)
app.use('/api/v1/reports', reports)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})