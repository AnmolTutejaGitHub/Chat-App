require('dotenv').config();
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
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;


app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true
}));
app.use(express.json());

const server = http.createServer(app);
//const io = socketio(server);
const io = socketio(server, {
    cors: {
        origin: `${process.env.FRONTEND_URL}`,
        credentials: true
    }
});

const PORT = process.env.PORT || 6969;


io.on('connection', (socket) => {
    socket.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    socket.on('join', async ({ username, room }) => {

        try {
            // const user = User.find({ name: username });
            // user.rooms.add(room);

            socket.join(room);

            const date = new Date();
            const timestamp = date.toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: 'numeric',
                minute: 'numeric',
                timeZone: 'Asia/Kolkata'
            });

            io.to(room).emit('message', { msg: `${username} has joined`, username: null, timestamp });
            io.to(room).emit('userJoined', { room });


            const message = new Message({ room_name: room, message: `${username} has joined`, username: null, timestamp, date: date });
            await message.save();

            const connection = new Connection({ socket_id: socket.id, room_name: room, username: username });
            await connection.save();

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
            timeZone: 'Asia/Kolkata'
        });
        io.to(room_name).emit('message', { msg, username, timestamp });
        const message = new Message({ room_name, message: msg, username, timestamp, date: date });
        await message.save();
    })

    socket.on('joinDM', async ({ sender, receiver, room }) => {
        try {
            socket.join(room);
            const connection = new Connection({ socket_id: socket.id, room_name: room, username: sender });
            await connection.save();
        } catch (e) {
            console.log(e);
        }
    })

    socket.on('SendDMMessage', async ({ room_name, msg, sender }) => {
        const date = new Date();
        const timestamp = date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'Asia/Kolkata'
        });

        io.to(room_name).emit('DMMessage', { msg, sender, timestamp });
        const message = new Message({ room_name, message: msg, username: sender, timestamp, date: date });
        await message.save();
    })

    socket.on('disconnect', async () => {
        try {
            const connection = await Connection.findOneAndDelete({ socket_id: socket.id });
            const room = connection?.room_name;

            const date = new Date();
            const timestamp = date.toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: 'numeric',
                minute: 'numeric',
                timeZone: 'Asia/Kolkata'
            });

            io.to(room).emit('message', { msg: `${connection?.username} has left`, username: null, timestamp });
            io.to(room).emit('userLeft', { room });

            const message = new Message({ room_name: room, message: `${connection?.username} has left`, username: null, timestamp, date: date });
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
        const messages = await Message.find({ room_name: room }).sort({ date: 1 });
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

        const token = jwt.sign({ user_id: user._id }, `${process.env.TOKEN_SECRET}`, { expiresIn: '30d' });
        res.status(200).send({ token });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.post('/signups', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const user = new User({ email, password, name });
        await user.save();
        const token = jwt.sign({ user_id: user._id }, `${process.env.TOKEN_SECRET}`, { expiresIn: '30d' });
        res.status(200).send({ token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})

app.post('/verifytokenAndGetUsername', async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
        const user = await User.findById(decoded.user_id);

        if (!user) {
            return res.status(404).send({ error: 'Invalid or expired token' });
        }

        res.status(200).send({ user: user.name });
    } catch (e) {
        res.status(400).send({ error: 'Invalid or expired token' });
    }
});


app.post('/otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "anmoltutejaserver@gmail.com",
                pass: process.env.NODEMAIL_APP_PASSWORD,
            },
        });

        let mailOptions = {
            from: "anmoltutejaserver@gmail.com",
            to: email,
            subject: 'Your login OTP',
            text: `Your OTP is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).send(error);
            }
            res.status(200).send(otp);
        });

    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/roomUsers', async (req, res) => {
    try {
        const { room_name } = req.body;
        const users = await Connection.find({ room_name });
        res.send(users);
    } catch (e) {
        res.status(400).send(e);
    }
})

app.post('/findUser', async (req, res) => {
    const { searchUser } = req.body;
    try {
        const user = await User.findOne({ name: searchUser.trim() });
        if (!user) res.status(400).send({ message: "User does not exist" });

        else res.status(200).send(user._id.toString());

    } catch (e) {
        res.status(400).send({ message: "User does not exist" });
    }
})


app.post('/createOrGetDMRoom', async (req, res) => {
    const Sender = await User.findOne({ name: req.body.sender });
    const Receiver = await User.findOne({ name: req.body.receiver });

    if (!Sender.chatted.includes(req.body.receiver)) Sender.chatted.push(req.body.receiver);
    if (!Receiver.chatted.includes(req.body.sender)) Receiver.chatted.push(req.body.receiver);

    await Sender.save();
    await Receiver.save();

    try {
        const room = new Room({ name: req.body.room_name })
        await room.save();
        res.status(200).send(room);
    } catch (e) {
        // --> already created
        res.status(200).send({ message: "already DMed once" });
    }
})

app.post('/getFriends', async (req, res) => {
    const username = req.body.user;
    try {
        const user = await User.findOne({ name: username });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send(user.chatted);
    }
    catch (e) {
        res.status(400).send(e);
    }
})

app.get('/rooms', async (req, res) => {
    try {
        const rooms = await Room.find({});
        const roomNames = rooms.map((room) => room.name);
        res.status(200).send(roomNames);
    } catch (e) {
        res.status(400).send(e);
    }
})

app.post('/resetPassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send({ error: 'Email is not registered with us' });
        user.password = req.body.password;
        await user.save();
        res.status(200).send('success');
    } catch (e) {
        res.status(400).send(e);
    }
})



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        resource_type: 'auto',
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 10000000 } });

app.post('/fileupload', upload.single('uploadfile'), (req, res) => {
    res.send({ message: 'File uploaded successfully!', url: req.file.path });
});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})