const mongoose = require('mongoose');
// i will be pputting which socketid is in connection which which room
const ConnectionSchema = new mongoose.Schema({
    socket_id: {
        type: String,
    },
    room_name: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        trim: true
    }
})

const Connection = mongoose.model('Connection', ConnectionSchema);
module.exports = Connection;