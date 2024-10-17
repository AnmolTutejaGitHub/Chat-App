const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    room_id: {
        type: String,
        trim: true
    },
    sender_id: {
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
    }
})

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;