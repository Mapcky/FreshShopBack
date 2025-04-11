const express = require('express')
const productController = require('../controllers/productController')
const router = express.Router()

router.post('/create', productController.createProduct)
router.get('/fromCategory/:categoryId',productController.getFromCategory)


module.exports = router