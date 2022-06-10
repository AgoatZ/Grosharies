const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const mongoose = require('./src/db');
const MongoStore = require('connect-mongo');

const app = express();
const http = require('http').createServer(app);
const session = require('express-session');
const passport = require('passport');
require('./src/common/middlewares/passport');

const routeUsers = require('./src/user/user.routes');
const routePosts = require('./src/post/post.routes');
const routePendings = require('./src/pending/pending.routes');
const routeGroceries = require('./src/grocery/grocery.routes');
const routeEvents = require('./src/event/event.routes');
const routeCategories = require('./src/category/category.routes');
const routeTags = require('./src/tag/tag.routes');
const routeAuth = require('./src/auth/auth.routes');
let mongoUrl;

if (process.env.NODE_ENV == "development") {
  const swaggerUI = require("swagger-ui-express")
  const swaggerJsDoc = require("swagger-jsdoc")
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Grosharies API",
        version: "1.0.0",
        description: "A zero-waste groceries sharing platform API",
      },
      servers: [{ url: "http://localhost:" + process.env.PORT, },],
    },
    apis: ["./src/user/*.routes.js"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

app.use(express.static(path.join(__dirname + '/../client/build')));
app.use(bodyParser.json({ limit: '16mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function (req, res, next) {
  if (process.env.NODE_ENV == "production") {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  else if (process.env.NODE_ENV == "development") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
if (process.env.NODE_ENV == "development") {
  const cors = require('cors');
  app.use(
    cors({
      origin: [`http://localhost:3000`, `https://localhost:3000`],
      credentials: "true",
    })
  );
  mongoUrl = process.env.MONGO_LOCAL_URL;
}
else if (process.env.NODE_ENV == "production") {
  mongoUrl = process.env.MONGO_ATLAS_URL;
}
const sessionMiddleware = session({
  secret: "secret-key",
  store: MongoStore.create({
    mongoUrl: mongoUrl,
  }),
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: false,
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', routeUsers, (req, res) => res.sendStatus(401));
app.use('/api/posts', routePosts, (req, res) => res.sendStatus(401));
app.use('/api/pendings', routePendings, (req, res) => res.sendStatus(401));
app.use('/api/groceries', routeGroceries, (req, res) => res.sendStatus(401));
app.use('/api/events', routeEvents, (req, res) => res.sendStatus(401));
app.use('/api/categories', routeCategories, (req, res) => res.sendStatus(401));
app.use('/api/tags', routeTags, (req, res) => res.sendStatus(401));
app.use('/api/auth', routeAuth, (req, res) => res.sendStatus(401));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

const socketIO = require('socket.io');
const { randomUUID } = require('crypto');
const sessionStore = mongoose.connection.collection('sessions');

const io = socketIO(http, {
  cors: {
      cors: {
          origin: "http://localhost:3000"
      }
  }
});
let gSocket;
/*
io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
      // find existing session
      const session = sessionStore.findOne(sessionID);
      if (session) {
          socket.sessionID = sessionID;
          socket.userID = session.userID;
          socket.username = session.username;
          return next();
      }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
      return next(new Error("invalid username"));
  }
  // create new session
  socket.sessionID = randomUUID();
  socket.userID = randomUUID();
  socket.username = username;
  next();
});
*/
const emitEvent = function (event, room, data) {
  io.to(room).emit(event, data);
};
console.log(typeof(emitEvent));
io.on("connection", socket => {
  console.log("New client connected");
  gSocket = socket;
  socket.join(socket.userID);

  console.log(`new connection ${socket.id}`);
  socket.on('whoami', (cb) => {
    cb(socket.request.user ? socket.request.user.username : '');
  });

  const session = socket.request.session;
  console.log(`saving sid ${socket.id} in session ${session.id}`);
  session.socketId = socket.id;
  session.save();

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
      users.push({
          sessionID: socket.sessionID,
          userID: socket.userID,
          username: socket.username,
      });
  }
  socket.emit("session", {
      sessionID: socket.sessionID,
      userID: socket.userID,
  });

  socket.emit("users", users);
  socket.on("pendPost", async (postId, collectorId, publisherId) => {
      io.emit("pend post notification", { postId: postId, collectorId: collectorId, publisherId: publisherId });
  });
  socket.on("pendPost", ({ postId, collectorId, publisherId }) => {
      socket.to(publisherId).to(collectorId).emit("pend post notification", {
          postId,
          from: collectorId,
          publisherId,
      });
  });

  socket.on("disconnect", async () => {
      const matchingSockets = await io.in(socket.userID).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
          // notify other users
          socket.broadcast.emit("user disconnected", socket.userID);
          // update the connection status of the session
          await sessionStore.insertOne({
              userID: socket.userID,
              username: socket.username,
              connected: false,
          });
      }
  });

  setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

  socket.on("disconnect", () => console.log("Client disconnected"));
});
setInterval(() => io.emit('time', '12345679'), 1000);
const wrap = (middleware) => {
  (socket, next) => middleware(socket.request, {}, next)
};
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  //console.log(socket.request);
  next();
});
module.exports = {
  app,
  http,
  emitEvent
};