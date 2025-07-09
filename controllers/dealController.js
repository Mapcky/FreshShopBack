const models = require('../models')
const { Op } = require('sequelize');


exports.create = async (req, res) => {

    const { name, starting_date, finish_date, type } = req.body

    try {

        const _ = await models.Deal.create({
            name: name,
            starting_date: starting_date,
            finish_date: finish_date,
            type: type
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
            include: [{
                model: models.DealItem,
                as: 'items',
                attributes: ['id', 'product_id', 'value']
            }]
        });

        res.status(200).json({ deals: deals, success: true })

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: "Error retrieving deals information", success: false })
    }
}