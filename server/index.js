import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://zap-chat-alpha.vercel.app","http://localhost:5173"],
        methods: ['GET', 'POST'],
    },
});

let users = [];

io.on('connection', (socket) => {
    console.log('A user connected : ', socket.id);

    // Handle user joining
    socket.on('join', (username) => {
        if (
            !username ||
            typeof username !== 'string' ||
            username.trim() === ''
        ) {
            socket.emit('error', 'Invalid username');
            return;
        }
        username = username.trim();
        // Check if username is already taken
        if (users.some((user) => user.username === username)) {
            socket.emit('error', 'Username already taken');
            return;
        }
        users.push({ id: socket.id, username });
        io.emit('users', users);
        io.emit('message', {
            username: 'System : ',
            message: `${username}` + ` has joined the chat`,
        });
        console.log(`User joined : ${username} (${socket.id})`);
    });

    // Handle incoming messages
    socket.on('message', (data) => {
        io.emit('message', { username: data.username, message: data.message });
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        const user = users.find((user) => user.id === socket.id);
        if (user) {
            users = users.filter((u) => u.id !== socket.id); // <- Fix here
            io.emit('users', users);
            io.emit('message', {
                username: 'System',
                message: `${user.username} has left the chat`,
            });
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
