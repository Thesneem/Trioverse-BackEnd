const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema(
    {
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        }]
    },
    {
        timestamps: true
    }
);

module.exports = ChatModel = mongoose.model('Chats', chatSchema);
