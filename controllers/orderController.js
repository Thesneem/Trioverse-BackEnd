require('dotenv').config(); // Load environment variables from .env file
const Stripe = require('stripe');
const usermodel = require('../models/userModel')
const ordermodel = require('../models/orderModel')
const reviewmodel = require('../models/reviewModel')

const stripe = new Stripe(process.env.Stripe_API)

module.exports = {
    stripe_PublishKey: async (req, res, next) => {
        return res.status(200).json({
            success: 'OK', result: process.env.STRIPE_PUBLISH
        })
    },

    createOrder: async (req, res, next) => {
        try {
            console.log('order controller reached')
            //console.log(formData)
            const { requirement, listing, item } = req.body
            console.log('REQBODY GOT FROM CHECKOUT', req.body)
            console.log(req.user.id)
            const file = req.file.filename
            const parsedListing = JSON.parse(listing);
            const parsedItem = JSON.parse(item);
            console.log(parsedListing, parsedItem)

            const paymentIntent = await stripe.paymentIntents.create({
                amount: parsedItem?.price,
                currency: "INR",
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            console.log(paymentIntent)
            console.log(parsedListing.category.categoryId.category)
            console.log(parsedItem.shortDescription)
            //creating an order
            const newOrder = new ordermodel({
                listing_id: parsedListing._id,
                buyer_id: req.user.id,
                seller_id: parsedListing.seller_id,
                'order_requirements.requirements': requirement,
                'order_requirements.file': file,
                paymentIntent: paymentIntent.id,
                order_Price: parsedItem?.price,
                'order_Status.pending.state': true,
                'order_Status.pending.date': Date.now(),
                selectedListing_title: parsedListing.listingTitle,
                listingDescription: parsedListing.description,
                listing_category: parsedListing.category.categoryId.category,
                listing_subcategory: parsedListing.category.subcategory,
                listing_features: parsedListing.features,
                images: parsedListing.images,
                videos: parsedListing.videos,
                files: parsedListing.files,
                coverImage: parsedListing.coverImage,
                'selected_Package.package': parsedItem.packageId.package,
                'selected_Package.delivery_Time': parsedItem.delivery_Time,
                'selected_Package.revisions': parsedItem.revisions,
                'selected_Package.deliverables': parsedItem.deliverables,
                'selected_Package.price': parsedItem.price,
                'selected_Package.shortDescription': parsedItem.shortDescription,
            })
            console.log('OrderCreated', newOrder)
            await newOrder.save()

            res.status(201).json({
                clientSecret: paymentIntent.client_secret, newOrder
            })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    getActiveOrder: async (req, res, next) => {
        try {
            const id = req.params.id
            const ActiveOrder = await ordermodel.find({
                $and: [{ listing_id: id }, { buyer_id: req.user.id }, {
                    'order_Status.created.state': true
                }, {
                    $or: [{ 'order_Status.finished.state': false }, { 'order_Status.canceled.state': false }
                    ]
                }]
            })
            console.log(ActiveOrder)
            res.status(200).json({ ActiveOrder })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    confirmOrder: async (req, res, next) => {
        try {
            const { email, paymentIntent } = req.body
            console.log(req.body)
            const order = await ordermodel.updateOne({ paymentIntent: req.body.paymentIntent }, {
                'order_Status.created.state': true,
                'order_Status.created.date': Date.now()
            })
            console.log('confirmOrder', order)
            res.status(200).json({ order })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    allBuyOrders: async (req, res, next) => {
        try {
            console.log(req.user.id)
            const orders = await ordermodel.find({
                buyer_id: req.user.id, 'order_Status.created.state': true
            }).populate('seller_id')
            console.log(orders)
            res.status(200).json({ orders })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    getOrder: async (req, res, next) => {
        try {
            const id = req.params.id
            const order = await ordermodel.findOne({ _id: id }).populate('seller_id').populate('listing_id').populate('buyer_id')
            console.log(order)
            res.status(200).json({ order })

        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    allSellOrders: async (req, res, next) => {
        try {
            console.log(req.user.id)
            const orders = await ordermodel.find({
                seller_id: req.user.id, 'order_Status.created.state': true
            }).populate('buyer_id')
            console.log(orders)
            res.status(200).json({ orders })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    startOrder: async (req, res, next) => {
        try {
            id = req.params.id

            const order = await ordermodel.updateOne({ _id: id }, {
                $set: {
                    'order_Status.started.state': true,
                    'order_Status.started.date': Date.now()
                }
            })
            console.log('Order Started', order)
            res.status(200).json({ order })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    deliverOrder: async (req, res, next) => {
        try {
            const orderId = req.params.id;
            const deliveryMessage = req.body.deliveryMessage;
            const deliveryItem = req.file.filename;
            console.log('reached deliverorder', orderId, deliveryMessage, deliveryItem)
            const order = await ordermodel.updateOne({ _id: orderId }, {
                $set: {
                    'order_Status.delivered.state': true,
                    'order_Status.returned.state': false,
                },
                $push: {
                    'order_Status.delivered.details': {
                        date: Date.now(),
                        delivery_Message: deliveryMessage,
                        delivery_item: [deliveryItem]
                    }
                }
            }
            )
            console.log('Order Started', order)
            res.status(200).json({ order })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    download: async (req, res, next) => {
        try {
            let item = req.params.id
            console.log(item)
            let file = './public/uploads/listingImages/' + req.params.id
            console.log(file)
            res.download(file, item);
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    acceptOrder: async (req, res, next) => {
        try {
            const id = req.params.id
            console.log(id)
            const order = await ordermodel.findByIdAndUpdate({ _id: id }, {
                $set: {
                    'order_Status.finished.state': true,
                    'order_Status.finished.date': Date.now()
                }
            })
            res.status(200).json({ order })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    returnDelivery: async (req, res, next) => {
        try {
            const id = req.params.id
            const returnMessage = req.body.returnMessage
            console.log(returnMessage)
            console.log(id)
            const order = await ordermodel.findByIdAndUpdate({ _id: id }, {
                $set: {
                    'order_Status.returned.state': true,
                    'order_Status.delivered.state': false,
                }, $push: {
                    'order_Status.returned.details': {
                        date: Date.now(),
                        return_Message: returnMessage,
                    }
                }
            })
            console.log(order)
            res.status(200).json({ order })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    checkUserOrdered: async (req, res, next) => {
        try {
            const listingid = req.params.id
            const buyer = req.user.id
            console.log(listingid, buyer)
            const hasOrdered = await ordermodel.find({
                $and: [{ listing_id: listingid }, { buyer_id: buyer }, {
                    'order_Status.created.state': true
                }, {
                    $or: [{ 'order_Status.finished.state': true }, { 'order_Status.canceled.state': true }
                    ]
                }]
            })
            console.log(hasOrdered)
            res.status(200).json({ hasOrdered })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    addReview: async (req, res, next) => {
        try {
            const listingid = req.params.id
            const reviewer = req.user.id
            const { review, rating } = req.body
            console.log(req.body)
            console.log('addREVIEW', listingid, reviewer)
            if (!review) {
                return res.status(400).json({ message: 'Review is required', success: false });
            }
            const newReview = await reviewmodel({
                listing_id: listingid,
                reviewer,
                review,
                rating,
                created_At: Date.now()
            })
            newReview.save().then(() => {
                res.status(201).json({ success: true, newReview });
            })

        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    allReviews: async (req, res, next) => {
        try {
            const listingid = req.params.id
            const reviews = await reviewmodel.find({ listing_id: listingid }).populate('reviewer')
            res.status(200).json({ reviews })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    isReviewExist: async (req, res, next) => {
        try {
            const listingid = req.params.id
            const reviewer = req.user.id
            const isReviewExist = await reviewmodel.findOne({ listing_id: listingid, reviewer: reviewer })
            console.log(isReviewExist)
            if (isReviewExist) {
                res.status(200).json({ ReviewExist: true })
            } else {
                res.status(200).json({ ReviewExist: false })

            }

        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error", success: false, err });
        }
    }

}