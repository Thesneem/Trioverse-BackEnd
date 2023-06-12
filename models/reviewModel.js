const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    created_At: {
        type: Date, default: Date.now()
    }
})

module.exports = PackageModel = mongoose.model('Reviews', reviewSchema);