const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
        },
    },
    {
        timestamps: true,
    }
);



module.exports = ChatModel = mongoose.model('Chats', chatSchema);