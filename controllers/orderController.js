const models = require('../models')
const cartController = require('./cartController')
const productController = require('./productController')


exports.createOrder = async (req,res) => {

    const userId = 1 //hardcoded
    
    const { order_items } = req.body

    const transaction = await models.Order.sequelize.transaction()


    try {

        const newOrder = await models.Order.create({
            user_id: userId
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
        return res.status(500).json({ message: 'Internal server error', success: false})
    }

}