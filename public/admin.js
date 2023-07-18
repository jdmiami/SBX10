document.addEventListener('DOMContentLoaded', () => {
    // Connect to the server as the admin
    const socket = io.connect('http://localhost:3000', { query: { isAdmin: true } });

    const modeSelect = document.getElementById('mode');
    const messagesDiv = document.getElementById('messages');
    const input = document.getElementById('input');
    const sendButton = document.getElementById('send');
    const usersDiv = document.getElementById('users'); // A div to display the list of users
    const userSelect = document.getElementById('user-select'); // A select box to choose a user to send message to

    modeSelect.addEventListener('change', () => {
        const mode = modeSelect.value;
        socket.emit('modeChange', mode);
    });

    sendButton.addEventListener('click', () => {
        const message = input.value;
        const userId = userSelect.value; // Get the selected user's ID
        input.value = '';
        // Emit the message with the selected user's ID
        socket.emit('message', { text: message, to: userId });
    });

    socket.on('message', (message) => {
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messagesDiv.appendChild(messageElement);
    });

    // Handle 'user connected' event
    socket.on('user connected', (user) => {
        const userElement = document.createElement('p');
        userElement.id = `user-${user.id}`;
        userElement.textContent = `User connected: ${user.username} (${user.ip})`;
        usersDiv.appendChild(userElement);

        // Add the new user to the select box
        const optionElement = document.createElement('option');
        optionElement.value = user.id;
        optionElement.textContent = `User: ${user.username} (${user.ip})`;
        userSelect.appendChild(optionElement);
    });

    // Handle 'user disconnected' event
    socket.on('user disconnected', (user) => {
        const userElement = document.getElementById(`user-${user.id}`);
        if (userElement) {
            userElement.textContent = `User disconnected: ${user.id}`;
        }
        // Remove the disconnected user from the select box
        const optionElement = document.getElementById(`user-${user.id}`);
        if (optionElement) {
            optionElement.remove();
        }
    });
});
