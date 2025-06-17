const express = require('express')
const addressController = require('../controllers/addressController')
const router = express.Router()

router.post('/setNew',addressController.setNewAddress)
router.get('/getAll',addressController.getAddresses)
router.post('/changeDefault', addressController.changeDefaultAddress)


module.exports = router