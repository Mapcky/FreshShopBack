const models = require('../models')
const stripe = require('stripe')(process.env.STRIPE_SK_KEY)


exports.simulator = async (req, res) => {

    const { totalAmount } = req.body

    await new Promise(resolve => setTimeout(resolve, 3000))

    res.status(200).json({ success: true })
}

exports.stripe = async (req, res) => {
    
    const { totalAmount } = req.body

    if (typeof totalAmount !== 'number' || isNaN(totalAmount) || totalAmount <= 0) {
        return res.status(400).json({ error: "Invalid total amount"})
    }

    const totalAmountInCents = Math.round(totalAmount * 100)

    const customer = await stripe.customers.create()

    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id},
        { apiVersion: '2025-02-24.acacia'}
    )

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmountInCents,
        currency: 'usd',
        customer: customer.id,
        automatic_payment_methods: {
            enabled: true
        }
    })

    res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: process.env.STRIPE_PK_KEY
    })
}