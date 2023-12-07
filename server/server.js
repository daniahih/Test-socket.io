const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const userSocketMap = new Map(); // Maps user IDs to sockets

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('register', (userId) => {
        userSocketMap.set(userId, socket.id);
    });

    socket.on('private message', ({ content, to }) => {
        const targetSocketId = userSocketMap.get(to);
        if (targetSocketId) {
            io.to(targetSocketId).emit('private message', {
                content,
                from: Array.from(userSocketMap.keys()).find(key => userSocketMap.get(key) === socket.id),
            });
        }
    });

    socket.on('disconnect', () => {
        userSocketMap.delete(Array.from(userSocketMap.keys()).find(key => userSocketMap.get(key) === socket.id));
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
