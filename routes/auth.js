const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()
const authenticate = require('../middlewares/authMiddleware')


router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/secureLogin',authenticate, authController.loginById)

module.exports = router