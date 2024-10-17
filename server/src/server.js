const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
const app = express();
require('../database/mongoose');
const User = require('../database/Models/User');
const Message = require('../database/Models/Message');
const Room = require('../database/Models/Room');
const Connection = require('../database/Models/Connection');
const bcrypt = require('bcrypt');

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
            io.to(room).emit('message', `${username} has joined`);

            const date = new Date();
            const timestamp = date.toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
            const message = new Message({ room_name: room, message: `${username} has joined`, username: null, timestamp });
            await message.save();

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

            const date = new Date();
            const timestamp = date.toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });

            const message = new Message({ room_name: room, message: `${connection?.username} has left`, username: null, timestamp });
            await message.save();

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

app.post('/allRooms', async (req, res) => {
    try {
        const room = req.body.room_name;
        const exist = await Room.findOne({ name: room });

        if (exist) {
            res.status(200).send(room);
        } else {
            res.status(404).send("No room with this name exists");
        }

    } catch (e) {
        res.status(400).send(e);
    }
});


app.post('/login', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const user = await User.findOne({ email, name });
        if (!user) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const user = new User({ email, password, name });
        await user.save();
        res.status(200).send(user);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})