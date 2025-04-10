const express = require('express')
const categoryController = require('../controllers/categoryController')
const router = express.Router()

router.get('/all', categoryController.getAllCategories)
router.post('/create', categoryController.createCategory)

module.exports = router