const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

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

    socket.on('disconnect', () => {
        console.log('connection disconnected');
    })
})

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})