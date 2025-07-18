import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "https://chat-connect-1.vercel.app", // ✅ updated to correct frontend URL
            "http://localhost:5173"              // ✅ keep this for local testing
        ],
        methods: ['GET', 'POST'],
    },
});

let users = [];

// ✅ Optional route for health check
app.get('/', (req, res) => {
    res.send('ChatConnect server is running.');
});

io.on('connection', (socket) => {
    console.log('A user connected : ', socket.id);

    // ✅ Handle user joining
    socket.on('join', (username) => {
        console.log(`JOIN EVENT received from ${username}`);

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
            username: 'System',
            message: `${username} has joined the chat`,
        });

        console.log(`User joined : ${username} (${socket.id})`);
    });

    // ✅ Handle incoming messages
    socket.on('message', (data) => {
        console.log(`MESSAGE from ${data.username}: ${data.message}`);
        io.emit('message', { username: data.username, message: data.message });
    });

    // ✅ Handle user disconnecting
    socket.on('disconnect', () => {
        const user = users.find((user) => user.id === socket.id);
        if (user) {
            users = users.filter((u) => u.id !== socket.id);
            io.emit('users', users);
            io.emit('message', {
                username: 'System',
                message: `${user.username} has left the chat`,
            });
            console.log(`User disconnected: ${user.username} (${socket.id})`);
        }
    });
});

// ✅ Listen on port 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
