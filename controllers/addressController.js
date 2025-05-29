const models = require('../models')


exports.setNewAddress = async (req, res) => {

    const userId = 1 //hardcode

    const { street, city, state, country, zip } = req.body

    try {

        const existingAddresses = await models.Address.findAll({
            where: { user_id: userId }
        })

        const isDefault = existingAddresses.length === 0

        const newAddress = await models.Address.create({
            street: street,
            city: city,
            state: state,
            country: country,
            zip: zip,
            user_id: userId,
            isDefault
        })

        res.status(201).json({ message: "Address created successfully", success: true, address: newAddress})

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error.", success: false })
    }

}



exports.getAddresses = async (req, res) => {

    const userId = 1 //hardcoded

    try {

    const userAddresses = await models.Address.findAll({
        where: {
            user_id: userId
        }
    })

    if (userAddresses.length === 0) {
        return res.status(404).json({ message: "No addresses found for this user.", success: false })
    }

    res.status(200).json({ addresses: userAddresses, success: true })



    } catch(error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error.", success: false })
    }
}
