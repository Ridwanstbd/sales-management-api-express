const express = require('express')
const reports = express.Router()
const { body, param, validationResult } = require('express-validator')
const { } = require('../controllers/reports')

module.exports = reports