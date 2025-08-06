const models = require('../models')
const { Op } = require('sequelize');


exports.create = async (req, res) => {

    const { name, starting_date, finish_date, type, image_url } = req.body

    try {

        const _ = await models.Deal.create({
            name: name,
            starting_date: starting_date,
            finish_date: finish_date,
            type: type,
            image_url: image_url
        })

        res.status(201).json({ message: "Deal created", success: true })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: 'An error ocurred while generating a new deal', success: true })
    }
}

exports.createItem = async (req, res) => {
    const { deal_id, product_id, value } = req.body

    try {

        const _ = await models.DealItem.create({
            deal_id: deal_id,
            product_id: product_id,
            value: value
        });

        res.status(201).json({ message: "Deal item created", success: true })


    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: 'An error ocurred while generating a new deal item', success: false })
    }
}

exports.getActiveDeals = async (req, res) => {
    const now = new Date();
    try {

        const deals = await models.Deal.findAll({
            where: {
                starting_date: { [Op.lte]: now },
                finish_date: { [Op.gte]: now }
            },
            attributes: ['id', 'name', 'starting_date', 'finish_date', 'type', 'image_url'],
            include: [{
                model: models.DealItem,
                as: 'items',
                attributes: ['id', 'deal_id', 'product_id', 'value'],
                include: [{
                    model: models.Product,
                    as: 'Product',
                    attributes: ['id', 'name', 'price', 'image_url', 'category_id', 'quantity', 'description']
                }]
            }]
        });

        res.status(200).json({ deals: deals, success: true })

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: "Error retrieving deals information", success: false })
    }
}


exports.productActiveDeal = async(req, res) => {

    const productId  = req.params.id
    const now = new Date();
    try {

        const dealItem = await models.DealItem.findOne({
            where: { product_id: productId 
            },
            attributes: ['id', 'deal_id', 'product_id', 'value'],
            include: [{
                model: models.Deal,
                attributes: ['id', 'name', 'starting_date', 'finish_date', 'type', 'image_url'],
                                where: {
                    starting_date: { [models.Sequelize.Op.lte]: now },
                    finish_date: { [models.Sequelize.Op.gte]: now }
                }
            }]
        })

        if (!dealItem) {
            return res.status(404).json({ message: "No active deal found for this product", success: false });
        }

        
        res.json({dealItem, success: true });

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: "Error retrieving deal information", success: false })
    }
}