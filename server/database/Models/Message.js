const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    room_name: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    timestamp: {
        type: String,
        trim: true
    },
    date: {
        type: String,
    }
})

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;