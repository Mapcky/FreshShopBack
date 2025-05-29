const models = require('../models')


exports.simulator = async (req, res) => {

    const { totalAmount } = req.body

    await new Promise(resolve => setTimeout(resolve, 3000))

    res.status(200).json({ success: true })
}