const models = require('../models')
//const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')


exports.register = async (req, res) => {

    try {
        const { username, password, first_name } = req.body

        const existingUser = await models.User.findOne({
            where: {
                username: { [Op.iLike]: username }
            }
        })

        if (existingUser) {
            return res.json({ message: "Username taken!", success: false })
        }

        //password hash
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        console.log(hash)

        // new user
        const _ = await models.User.create({
            username: username,
            password: hash,
            first_name: first_name
        })
        res.status(201).json({ success: "true" })


    } catch (error) {
        res.status(500).json({ message: "Internal server error.", success: false })
    }
}