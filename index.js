const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const swaggerConfig = require('./config/swagger')
const app = express()
const port = 3000

const accounts = require('./routers/accounts')
const journals = require('./routers/journals')

app.use(cors())
app.use(bodyParser.json())
swaggerConfig(app);
app.get('/', (req, res) => {
    res.send('Hello hAHAHAHAHICI')
})
app.use('/accounts', accounts)
app.use('/journals', journals)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})