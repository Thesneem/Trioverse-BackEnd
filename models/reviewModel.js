const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    listing_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "listingsData",
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    created_At: {
        type: Date, default: Date.now()
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
})

module.exports = PackageModel = mongoose.model('Reviews', reviewSchema);