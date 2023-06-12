const chatmodel = require('../models/chatModel')
const messagemodel = require('../models/messageModel')
const usermodel = require('../models/userModel')
const listingmodel = require('../models/listingModel')

module.exports = {
    createChat: async (req, res, next) => {
        try {
            const senderId = req.user.id
            console.log(senderId)
            const { receiver_id } = req.body
            console.log('reci', receiver_id)
            const isExist = await chatmodel.find({ members: { $all: [senderId, receiver_id] } })
            if (!isExist) {
                const newChat = new chatmodel({
                    members: [senderId, receiver_id],
                });

                const result = await newChat.save();
                res.status(201).json(result);
            }
            else {
                res.status(200).json(isExist)
            }

        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Internal server error", success: false, err });

        }
    },
    userChats: async (req, res, next) => {
        try {
            console.log('testDATA', req.user.id)
            const chat = await chatmodel.find({
                members: { $in: [req.user.id] },
            });
            res.status(200).json(chat);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    findChat: async (req, res, next) => {
        try {
            const chat = await chatmodel.findOne({
                members: { $all: [req.params.firstId, req.params.secondId] },
            });
            res.status(200).json(chat)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    addMessage: async (req, res, next) => {
        try {
            const { chatId, senderId, text } = req.body;
            const message = new messagemodel({
                chatId,
                senderId,
                text,
            });
            const result = await message.save();
            res.status(200).json(result)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    getMessages: async (req, res, next) => {
        try {
            const { chatId } = req.params;
            const result = await messagemodel.find({ chatId });
            res.status(200).json(result);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Internal server error", success: false, err });
        }
    }
}
