// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:3000', "echo-protocol");

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

// Listen for closed
socket.addEventListener('close', function (event) {
    console.log('Server closed', event.data);
});

// Listen for error
socket.addEventListener('error', function (event) {
    console.error('Server error', event.data);
});