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


exports.updateProductStock = async (updateData, transaction) => {
    try {

        const productIds = updateData.map(item => item.productId)


        const products = await models.Product.findAll({
            where: { id: productIds },
            transaction
        })

        const productMap = products.reduce((acc, product) => {
            acc[product.id] = product
            return acc
        }, {})


        for (const item of updateData) {
            const product = productMap[item.productId]

            if (!product) {
                throw new Error('Product not found')
            }

            if (product.quantity < item.quantity) {
                throw new Error('Insufficent stock')
            }

            product.quantity -= item.quantity

            await models.Product.update(
                { quantity: product.quantity },
                { where: { id: product.id }, transaction }
            )
        }

        return { success: true }


    } catch (error) {
        console.error(error.message)
        throw error
    }
}