const express = require('express')
const dealController = require('../controllers/dealController')
const router = express.Router()

router.get('/active',dealController.getActiveDeals)
router.post('/create', dealController.create)
router.post('/create-item', dealController.createItem)

module.exports = router