const models = require('../models')
const jwt = require('jsonwebtoken')


const authenticate = async (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await models.User.findByPk(decoded.userId)

        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        req.userId = user.id
        next()

    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: 'Invalid or expired token' })
    }
}

module.exports = authenticate