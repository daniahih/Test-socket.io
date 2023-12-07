const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",  // For testing purposes, this is set to allow any origin
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
    console.log('A user connected with socket ID:', socket.id);

    socket.on('chat message', (msg) => {
        // Broadcast message to all connected clients
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
