const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        default: 'List'
    },
    subcategories: [{
        subcategory: {
            type: String,
        },
        status: {
            type: String,
            default: 'List'
        }
    }]
})


module.exports = CategoryModel = mongoose.model('Categories', categorySchema);