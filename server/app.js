const { app, http } = require('./index');

const port = process.env.PORT || 5000;
const server = http.listen(port, () => {
    console.log(`Server is running \nlistening on port ${port}...`);
});
// const io = socketIO(server, {
//     cors: {
//         cors: {
//             origin: "http://localhost:3000"
//         }
//     }
// });

// io.use((socket, next) => {
//     const sessionID = socket.handshake.auth.sessionID;
//     if (sessionID) {
//         // find existing session
//         const session = sessionStore.findOne(sessionID);
//         if (session) {
//             socket.sessionID = sessionID;
//             socket.userID = session.userID;
//             socket.username = session.username;
//             return next();
//         }
//     }
//     const username = socket.handshake.auth.username;
//     if (!username) {
//         return next(new Error("invalid username"));
//     }
//     // create new session
//     socket.sessionID = randomUUID();
//     socket.userID = randomUUID();
//     socket.username = username;
//     next();
// });

// io.on("connection", socket => {
//     console.log("New client connected");

//     socket.join(socket.userID);

//     const users = [];
//     for (let [id, socket] of io.of("/").sockets) {
//         users.push({
//             sessionID: socket.sessionID,
//             userID: socket.userID,
//             username: socket.username,
//         });
//     }
//     socket.emit("session", {
//         sessionID: socket.sessionID,
//         userID: socket.userID,
//     });

//     socket.emit("users", users);
//     socket.on("pendPost", async (postId, collectorId, publisherId) => {
//         io.emit("pend post notification", { postId: postId, collectorId: collectorId, publisherId: publisherId });
//     });
//     socket.on("pendPost", ({ postId, collectorId, publisherId }) => {
//         socket.to(publisherId).to(collectorId).emit("pend post notification", {
//             postId,
//             from: collectorId,
//             publisherId,
//         });
//     });

//     socket.on("disconnect", async () => {
//         const matchingSockets = await io.in(socket.userID).allSockets();
//         const isDisconnected = matchingSockets.size === 0;
//         if (isDisconnected) {
//             // notify other users
//             socket.broadcast.emit("user disconnected", socket.userID);
//             // update the connection status of the session
//             sessionStore.saveSession(socket.sessionID, {
//                 userID: socket.userID,
//                 username: socket.username,
//                 connected: false,
//             });
//         }
//     });

//     setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

//     socket.on("disconnect", () => console.log("Client disconnected"));
// });

// module.exports = io;
