// Import required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize express and define a port
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static('public'));

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

let users = {}; // Store user information
let adminSocket = null; // Store the admin's socket

// Listen for client connections
io.on('connection', (socket) => {
    console.log('a user connected');
    console.log('User ID: ' + socket.id); // Logs the unique ID of the user

    // If the connected user is the admin, store their socket
    if (socket.handshake.query.isAdmin) {
        adminSocket = socket;
    }

    // Store user information
    users[socket.id] = {
        ip: socket.request.headers['x-forwarded-for'] || socket.conn.remoteAddress,
        username: `Visitor#${socket.id}`
    };

    // If the admin is connected, send them the new user's information
    if (adminSocket) {
        adminSocket.emit('user connected', users[socket.id]);
    }

    console.log('Current Users: ', users); // Debug, remove or comment this in production

    // Emit a welcome message with the ID
    socket.emit('welcome', { id: socket.id });

    socket.on('modeChange', (mode) => {
        console.log('Mode changed to: ' + mode);
        // TODO: Implement mode change
    });

    socket.on('message', (msg) => {
        const { text, to } = msg;
        console.log('Admin message: ' + text);
        // Send message to specific user
        if (to) {
            io.to(to).emit('message', text);
        } else {
            io.emit('message', text);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete users[socket.id]; // Remove the user from the users object when they disconnect

        // If the admin is connected, inform them that the user has disconnected
        if (adminSocket) {
            adminSocket.emit('user disconnected', { id: socket.id });
        }
    });
});

// Start server listening process.
server.listen(3000, () => {
    console.log('listening on *:3000');
});
