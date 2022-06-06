const app = require('./index');
const http = require('http').Server(app);
const socketIO = require('socket.io');

const port = process.env.PORT || 5000;
const server = http.listen(port, () => {
    console.log(`Server is running \nlistening on port ${port}...`);
});
const io = socketIO(server, {
    transports: ['polling'],
    cors: {
        cors: {
            origin: "http://localhost:3000"
        }
    }
});

io.on("connection", socket => {
    console.log("New client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
});

module.exports = io;