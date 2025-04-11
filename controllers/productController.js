const models = require('../models')
const { Op } = require('sequelize')


exports.createProduct = async (req, res) => {
    try {
        const { name, price, quantity, image_url, category_id } = req.body

        const existingProduct = await models.Product.findOne({
            where: {
                name: { [Op.iLike]: name }
            }
        })

        if (existingProduct) {
            return res.json({ message: "Product already exists", success: false })
        }

        const _ = await models.Product.create({
            name: name,
            price: price,
            quantity: quantity,
            image_url: image_url,
            category_id: category_id
        })
        res.status(201).json({ message: "Product created", success: "true" })


    } catch (error) {
        res.status(500).json({ message: "Internal server error.", success: false })
    }
}


exports.getFromCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId
        
        const products = await models.Product.findAll({
            where: {
                category_id: categoryId
            },
            attributes: ['id', 'name', 'price', 'quantity', 'image_url', 'category_id']
        })

        res.status(200).json({ products, success: true })

    } catch {
        return res.status(500).json({ message: 'Internal server error', success: false })
    }
}