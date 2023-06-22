const chatmodel = require('../models/chatModel')
const messagemodel = require('../models/messageModel')
const usermodel = require('../models/userModel')
const listingmodel = require('../models/listingModel')
// const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    createChat: async (req, res, next) => {
        try {


            const senderId = req.user.id
            const { receiver_id } = req.body
            const isExist = await chatmodel.find({ members: { $all: [senderId, receiver_id] } });
            console.log(isExist)
            if (isExist.length === 0) {
                const newChat = new chatmodel({
                    members: [senderId, receiver_id]
                })
                await newChat.save()
                res.status(201).json('OK');
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
            }).populate('members')

            console.log(chat)

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
            console.log('hii', req.body)
            const message = new messagemodel({
                chatId: chatId,
                senderId: senderId,
                text: text
            });

            const result = await message.save();

            res.status(201).json(result)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Internal server error", success: false, err });
        }
    },
    getMessages: async (req, res, next) => {
        try {
            const { chatId } = req.params;
            console.log(chatId)
            const messages = await messagemodel.find({ chatId });
            console.log(messages)
            res.status(200).json(messages);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ message: "Internal server error", success: false, err });
        }
    }
}
