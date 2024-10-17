const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
const app = express();
require('../database/mongoose');
const User = require('../database/Models/User');
const Message = require('../database/Models/Message');
const Room = require('../database/Models/Room');
const Connection = require('../database/Models/Connection')

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

    //socket.emit('message', 'welcome');

    socket.on('join', async ({ username, room }) => {

        try {
            // const user = User.find({ name: username });
            // user.rooms.add(room);

            socket.join(room);
            socket.broadcast.to(room).emit('message', `${username} has joined`);

            const connection = new Connection({ socket_id: socket.id, room_name: room, username: username });
            await connection.save();

            console.log(`Connection saved for socket ID: ${socket.id}`);

        } catch (error) {
            console.error('Error saving connection:', error);
        }
    })

    socket.on('SendMessage', async ({ room_name, msg, username }) => {
        const date = new Date();
        const timestamp = date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
        io.to(room_name).emit('message', `${msg} by ${username} at ${timestamp}`);
        const message = new Message({ room_name, message: msg, username, timestamp });
        await message.save();
    })

    socket.on('disconnect', async () => {
        try {
            const connection = await Connection.findOneAndDelete({ socket_id: socket.id });
            const room = connection?.room_name;
            io.to(room).emit('message', `${connection?.username} has left`);
        } catch (e) {
            console.error(e);
        }
    });
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

app.post('/roomMessages', async (req, res) => {
    const room = req.body.room_name;
    try {
        const messages = await Message.find({ room_name: room }).sort({ timestamp: 1 });
        res.send(messages);
    } catch (err) {
        res.status(400).send(e);
    }
})

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})