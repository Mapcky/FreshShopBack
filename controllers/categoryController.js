const models = require('../models')


exports.getAllCategories = async (req, res) => {
    const categories = await models.Category.findAll()
    res.json(categories)
}