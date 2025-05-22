const express = require('express')
const orderController = require('../controllers/orderController')
const router = express.Router()


router.post('/create', orderController.createOrder)
router.get('/loadOrders', orderController.loadOrders)

module.exports = router