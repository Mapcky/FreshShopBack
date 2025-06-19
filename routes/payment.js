const express = require('express')
const paymentController = require('../controllers/paymentController')
const router = express.Router()


router.post('/simulate', paymentController.simulator)
router.post('/stripePaymentIntent', paymentController.stripe)

module.exports = router