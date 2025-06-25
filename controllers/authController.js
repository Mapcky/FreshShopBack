const models = require('../models')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')


exports.register = async (req, res) => {

    try {
        const { username, password, first_name, last_name, email } = req.body

        const existingUser = await models.User.findOne({
            where: {
                username: { [Op.iLike]: username }
            }
        })

        if (existingUser) {
            return res.status(409).json({ message: "Username taken!", success: false })
        }

        //password hash
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        // new user
        const newUser = await models.User.create({
            username: username,
            password: hash,
            first_name: first_name,
            last_name: last_name,
            email: email
        })

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.status(201).json({ user: newUser, token, success: true })


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error.", success: false })
    }
}


exports.login = async (req, res) => {

    try {

        const { username: inputUsername, password } = req.body

        // check if user exists
        const existingUser = await models.User.findOne({
            where: {
                username: { [Op.iLike]: inputUsername }
            }
        })

        if (!existingUser) {
            return res.json({ message: "Username or password is incorrect", success: false })
        }

        // check the passsword
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) {
            return res.json({ message: "Username or password is incorrect", success: false })
        }

        const { id, username, first_name, last_name, image_url, email } = existingUser
        const user = { id, username, first_name, last_name, image_url, email }

        // generate JWT token
        const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        return res.status(200).json({ user: user, token, success: true })

    } catch (error) {
        res.status(500).json({ message: "Internal server error.", success: false })
    }
}

exports.loginById = async (req, res) => {

    const user = await models.User.findByPk(req.userId, {
        attributes: ['id', 'username', 'first_name', 'last_name', 'image_url', 'email']
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found', success: false });
    }

    return res.status(200).json({ user: user, success: true });

}

