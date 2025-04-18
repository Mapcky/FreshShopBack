const models = require('../models')
require('dotenv').config()
const jwt = require('jsonwebtoken')
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


exports.login = async (req, res) => {

    try {
        
    const { username, password } = req.body

    // check if user exists
    const existingUser = await models.User.findOne({
        where: {
            username: { [Op.iLike]: username }
        }
    })

    if (!existingUser) {
        return res.json({ message: "Username or password is incorrect", success: false })
    }

    // check the passsword
    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if(!isPasswordValid) {
        return res.json({ message: "Username or password is incorrect", success: false })
    }

    // generate JWT token
    const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })

    return res.status(200).json({ userId: existingUser.id, username: existingUser.username, token, success: true })

    } catch (error) {
        res.status(500).json({ message: "Internal server error.", success: false })
    }
}

