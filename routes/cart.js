const express = require('express')
const cartController = require('../controllers/cartController')
const router = express.Router()


router.get('/', cartController.loadCart)
router.post('/addItem',cartController.addCartItem)
router.delete('/removeItem/:cartItemId', cartController.removeCartItem)

module.exports = router