const socket = io.connect('http://localhost:8080', { path: '/bookHub', });

// Send event to the server
const sendMessage = () => {
    const content = document.getElementById('event').value;
    // socket.emit('content', content);
    document.getElementById('message').value = '';
}

// Receive event from the server
socket.on('new-book-added', (eventName) => {
    const newMessage = document.createElement('li');
    newMessage.textContent = eventName;
    document.getElementById('new-event').appendChild(newMessage);
});