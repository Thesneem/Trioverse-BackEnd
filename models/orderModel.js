const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    listing_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "listingsData",
    },
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    order_email: {
        type: String,

    },
    order_requirements: {
        requirements: {
            type: String,
            required: true
        },
        file: {
            type: String
        }
    },
    paymentIntent: {
        type: String,
        unique: true
    },
    order_Price: {
        type: Number
    },
    sellerPayment_Status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },

    revision_Count: {
        type: Number,
    },
    order_Status: {
        pending: {
            state: { type: Boolean, default: false },
            date: { type: Date, default: Date.now() },
        },
        created: {
            state: { type: Boolean, default: false },
            date: { type: Date, default: Date.now() }
        },
        started: {
            state: { type: Boolean, default: false },
            date: { type: Date, default: Date.now() },
        },
        delivered: {
            state: { type: Boolean, default: false },
            details: [{
                date: { type: Date, default: Date.now() },
                delivery_Message: { type: String },
                delivery_item: [{ type: String }]
            }]
        },
        returned: {
            state: { type: Boolean, default: false },
            details: [{
                date: { type: Date, default: Date.now() },
                return_Message: { type: String }
            }]
        },
        finished: {
            state: { type: Boolean, default: false },
            date: { type: Date, default: Date.now() },
        },
        canceled: {
            state: { type: Boolean, default: false },
            reason: { type: String },
            date: { type: Date, default: Date.now() },
        },
    },
    timer_value: {
        type: String
    },
    //to save all the data related to order, so that editing the listing will not effect the order
    selectedListing_title: {
        type: String
    },
    listingDescription: {
        type: String
    },
    listing_category: {
        type: String
    },
    listing_subcategory: {
        type: String
    },
    listing_features: [{
        type: String
    }],
    images: [{
        type: String
    }],
    videos: [{
        type: String
    }],
    files: [{
        type: String
    }],
    coverImage: {
        type: String
    },
    selected_Package: {
        package: {
            type: String
        },
        delivery_Time: {
            type: Number
        },
        revisions: {
            type: Number
        },
        deliverables: [{
            type: String
        }],
        price: {
            type: Number
        },
        shortDescription: {
            type: String
        }
    }

})


module.exports = OrderModel = mongoose.model('orderData', orderSchema);