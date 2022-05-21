const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const MongoStore = require('connect-mongo');
const cors = require('cors');

const app = express();
const session = require('express-session');
const passport = require('passport');
require('./src/common/middlewares/passport');

const routeTasks = require('./src/routes/tasks');
const routeUsers = require('./src/user/user.routes');
const routePosts = require('./src/post/post.routes');
const routePendings = require('./src/pending/pending.routes');
const routeGroceries = require('./src/grocery/grocery.routes');
const routeEvents = require('./src/event/event.routes');
const routeCategories = require('./src/category/category.routes');
const routeTags = require('./src/tag/tag.routes');
const routeAuth = require('./src/auth/auth.routes');

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
          servers: [{url: "http://localhost:" + process.env.PORT,},],
      },
      apis: ["./src/user/*.routes.js"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json({ limit: '16mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
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
app.use(
  cors({
    origin: [`http://localhost:3000`, `https://localhost:3000`],
    credentials: "true",
  })
);
app.use(
  session({
    secret: "secret-key",
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/grosharies",
    }),
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/tasks', routeTasks, (req, res) => res.sendStatus(401));
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

module.exports = app;