require('dotenv').config(); // Load environment variables from .env file
const Stripe = require('stripe');
const usermodel = require('../models/userModel')

const stripe = new Stripe(process.env.Stripe_API)

module.exports = {
    createOrder: async (req, res, next) => {
        try {
            console.log('order controller reached')

            const paymentIntent = await stripe.paymentIntents.create({
                //amount: listing?.price * 100,
                amount: 1000,
                currency: "INR",
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            console.log(paymentIntent)
            res.status(201).json({
                clientSecret: paymentIntent.client_secret,
            })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    }
}