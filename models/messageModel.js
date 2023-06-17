const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chats",
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        text: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = MessageModel = mongoose.model('Messages', messageSchema);