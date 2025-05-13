const models = require('../models')


exports.loadCart = async (req, res) => {
    try {
        const userId = 1//hardcoded req.userId

        let cart = await models.Cart.findOne({
            where: {
                user_id: userId,
                is_active: true
            },
            attributes: ['id', 'user_id', 'is_active'],
            include: [
                {
                    model: models.CartItem,
                    as: 'cartItems',
                    attributes: ['id', 'cart_id', 'product_id', 'quantity'],
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

        if (!cart) {
            cart = await models.Cart.create({
                user_id: userId,
                is_active: true
            })
        }

        res.status(200).json({ cart: cart, success: true })

    } catch (error) {
        return res.status(500).json({ message: 'An error ocurred while loading the cart', success: false })
    }
}

exports.addCartItem = async (req, res) => {

    const userId = 1//hardcoded req.userId get from middleware
    const { productId, quantity } = req.body

    try {

        const cart = await models.Cart.findOne({
            where: {
                user_id: userId,
                is_active: true
            }
        })

        const [cartItem, created] = await models.CartItem.findOrCreate({
            where: {
                cart_id: cart.id,
                product_id: productId
            },
            defaults: { quantity }
        })

        const product = await models.Product.findByPk(productId)

        if (!created) {
            //item already exists

            //don't want to superpass the product stock, temporal solution
            const avaliableStock = product.quantity - cartItem.quantity

            if (avaliableStock > 0) {
                cartItem.quantity += quantity
            } else {
                cartItem.quantity = product.quantity
            }
            //save it
            await cartItem.save()
        }

        //response with cartItem

        const cartItemResponse = await models.CartItem.findOne({
            where: {
                id: cartItem.id
            },
            attributes: ['id', 'cart_id', 'product_id', 'quantity'],
            include: [
                {
                    model: models.Product,
                    as: 'Product',
                    attributes: ['id', 'name', 'price', 'image_url', 'category_id', 'quantity']
                }
            ]
        })

        res.status(201).json({ message: 'cart item added', success: true, cartItem: cartItemResponse })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'An error ocurred while adding an item to the cart', success: false })
    }
}


exports.removeCartItem = async (req, res) => {
    try {

        const { cartItemId } = req.params

        const deletedItem = await models.CartItem.destroy({
            where: {
                id: cartItemId
            }
        })

        if (!deletedItem) {
            return res.status(404).json({ message: 'Cart item not found', success: false})
        }

        res.status(200).json({ success: true })

    } catch (error) {
        return res.status(500).json({ message: 'An error ocurred while removing the cart item', success: false})
    }
}


exports.cleanCart = async (cartId, transaction) => {
    return await models.CartItem.destroy({
        where: {cart_id: cartId},
        transaction
    })
}