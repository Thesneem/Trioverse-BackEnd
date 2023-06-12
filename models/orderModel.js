const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    bill_amount: {
        type: String,
        required: true
    },
    order_status: {
        type: String,
        required: true
    }
})


module.exports = OrderModel = mongoose.model('orderData', orderSchema);