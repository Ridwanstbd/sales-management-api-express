const express = require('express')
const journals = express.Router()
const { getJournals, getJournalById, createJournal } = require('../controllers/journals')

journals.get('/', async (req, res) => {
    res.send(getJournals())
})
journals.route('/').post(async (req, res) => {
    const { data, details } = req.body;
    res.send(await createJournal(data, details))
})
journals.route('/:id').get(async (req, res) => {
    const { id } = req.params
    res.send(getJournalById(id))
})
journals.route('/:id').put(async (req, res) => {

})
journals.route('/:id').delete(async (req, res) => {

})

module.exports = journals
