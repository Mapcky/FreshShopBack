const models = require('../models')
const { Op } = require('sequelize')


exports.getAllCategories = async (req, res) => {
    const categories = await models.Category.findAll()
    res.json(categories)
}


exports.createCategory = async (req, res) => {

    try {
        const { name, image_url } = req.body

        const existingCategory = await models.Category.findOne({
            where: {
                name: { [Op.iLike]: name }
            }
        })

        if (existingCategory) {
            return res.json({ message: "Category already exists", success: false })
        }

        const _ = await models.Category.create({
            name: name,
            image_url: image_url
        })
        res.status(201).json({ message: "Category created", success: "true" })


    } catch (error) {
        res.status(500).json({ message: "Internal server error.", success: false })
    }
}