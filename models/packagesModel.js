const mongoose = require('mongoose');
const packageSchema = new mongoose.Schema({
    package: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        default: 'List'
    },
})

module.exports = PackageModel = mongoose.model('Packages', packageSchema);