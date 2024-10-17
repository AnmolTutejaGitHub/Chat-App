const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
const app = express();
require('../database/mongoose');
const User = require('../database/Models/User');
const Message = require('../database/Models/Message');
const Room = require('../database/Models/Room');

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

const server = http.createServer(app);
//const io = socketio(server);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

const PORT = process.env.PORT || 6969;


io.on('connection', (socket) => {
    console.log('new websocket connection');

    socket.emit('message', 'welcome');

    socket.on('join', ({ username, room }) => {

        try {
            // const user = User.find({ name: username });
            // user.rooms.add(room);
            socket.join(room);
            socket.broadcast.to(room).emit('message', `${username} has joined`);
        } catch (e) {

        }
    })

    socket.on('SendMessage', ({ room_name, msg }) => {
        console.log(`Message received for room ${room_name}: ${msg}`);
        io.to(room_name).emit('message', msg);
    })

    socket.on('disconnect', () => {
        console.log('connection disconnected');
    })
})


app.post('/createRoom', async (req, res) => {
    try {
        const room = new Room({ name: req.body.room_name })
        await room.save();
        res.status(200).send(room);

    } catch (e) {
        res.status(400).send(e);
    }
})

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})