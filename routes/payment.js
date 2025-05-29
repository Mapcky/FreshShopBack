const express = require('express')
const paymentController = require('../controllers/paymentController')
const router = express.Router()


router.post('/simulate', paymentController.simulator)

module.exports = router