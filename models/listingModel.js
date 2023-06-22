const mongoose = require('mongoose');
const listingSchema = new mongoose.Schema({
    listingTitle: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    category: {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categories",
        },
        subcategory: {
            type: String
        }
    },
    packages: [{
        packageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Packages",
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
    }],
    features: [{
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

    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    created_At: {
        type: Date, default: Date.now()
    },
    orders: [{
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orderData",
        }
    }],
    listing_status: {
        type: 'String',
        default: 'Active'
    }
    ,
    reviews: [{
        reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reviews",
        }
    }],
    requirements: {
        type: String
    }
}

)


module.exports = ListingModel = mongoose.model('listingsData', listingSchema);