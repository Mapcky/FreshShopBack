const models = require('../models')
const cartController = require('./cartController')
const productController = require('./productController')


exports.createOrder = async (req, res) => {

    const userId = 1 //hardcoded

    const { order_items, total } = req.body

    const transaction = await models.Order.sequelize.transaction()


    try {

        const newOrder = await models.Order.create({
            user_id: userId,
            total: total
        }, { transaction })

        const newOrderItems = order_items.map(item => ({
            order_id: newOrder.id,
            product_id: item.productId,
            quantity: item.quantity
        }))

        await models.OrderItem.bulkCreate(newOrderItems, { transaction })


        const stockUpdateData = newOrderItems.map(({ product_id, quantity }) => ({
            productId: product_id,
            quantity
        }))

        await productController.updateProductStock(stockUpdateData, transaction)

        const cart = await models.Cart.findOne({
            where: {
                user_id: userId
            }
        })

        await cartController.cleanCart(cart.id, transaction)

        await transaction.commit()


        return res.status(200).json({ success: true })


    } catch (error) {
        console.log(error)
        transaction.rollback()
        return res.status(500).json({ message: 'Internal server error', success: false })
    }

}


exports.loadOrders = async (req, res) => {

    const userId = 1 //hardcoded

    try {

        const orders = await models.Order.findAll({
            where: {
                user_id: userId
            },
            attributes: ['id', 'user_id', 'status','total','createdAt'],
            include: [
                {
                    model: models.OrderItem,
                    as: 'orderItems',
                    attributes: ['id', 'order_id', 'product_id','quantity'],
                    include: [
                        {
                            model: models.Product,
                            as: 'Product',
                            attributes: ['id', 'name', 'price', 'image_url', 'category_id', 'quantity']
                        }
                    ]
                }
            ]
        })

        res.status(200).json({ orders, success: true})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error', success: false })

    }

}