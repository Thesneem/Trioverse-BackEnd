const mongoose = require('mongoose');
const commissionSchema = new mongoose.Schema({
    commission_percentage: {
        type: Number,
        required: true
    },

}, {
    timestamps: true
}
)


module.exports = CommissionModel = mongoose.model('CommissionData', commissionSchema);