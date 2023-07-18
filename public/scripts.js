document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://localhost:3000');

    socket.on('connect', () => {
        console.log('Connected to the server'); // Logs when the client connects to the server
    });

    // New: Listen for 'welcome' event and log the unique ID
    socket.on('welcome', (data) => {
        console.log('My ID is: ' + data.id);
    });

    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    const buttons = [
        'home-button',
        'pricing-button',
        'about-button',
        'call-button',
        'cart-button'
    ];

    buttons.forEach((button) => {
        document.getElementById(button).addEventListener('click', () => {
            const message = button.replace('-button', '');
            sendMessage(message);
        });
    });

    function sendMessage(message) {
        socket.emit('message', message);
        const messageElement = document.createElement('p');
        messageElement.textContent = `You: ${message}`;
        chatBox.appendChild(messageElement);
    }

    socket.on('message', (message) => {
        console.log('Received message: ' + message); // Logs received messages
        const messageElement = document.createElement('p');
        messageElement.textContent = `Agent: ${message}`;
        chatBox.appendChild(messageElement);
    });

    sendButton.addEventListener('click', () => {
        const message = messageInput.value;
        console.log('Send button clicked, message is: ', message); //Debug
        messageInput.value = '';
        sendMessage(message);
    });
});
