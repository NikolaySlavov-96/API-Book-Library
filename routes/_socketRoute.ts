export default (io) => {
    io.on('connection', (socket) => {

        console.log('Client connected');

        // socket.on('message', (message) => {
        //     console.log('Message Received: ', message);

        //     io.emit('message', message);
        // });

        // socket.on('disconnect', () => {
        //     console.log('Client Disconnected');
        // });

    });
};