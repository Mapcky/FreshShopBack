const models = require('../models')


exports.loadCart = async(req, res) => {
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
                            attributes: ['id', 'name', 'price', 'image_url', 'category_id']
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

        const [cartItem, created] = await models.cartItem.findOrCreate({
          where: {
            cart_id: cart.id,
            product_id: productId
          },
          defaults: { quantity }
        })

        if (!created) {
            //item already exists
            cartItem.quantity += quantity
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
                    attributes: ['id', 'name', 'price', 'image_url', 'category_id']
                }
            ]
        })

        res.status(201).json({ message: 'cart item added', success: true, cartItem: cartItemResponse })

    } catch {
        return res.status(500).json({ message: 'An error ocurred while loading the cart', success: false })
    }
}