const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const routeTasks = require('./src/routes/tasks');
const routeUsers = require('./src/user/user.routes');
const routePosts = require('./src/post/post.routes');
const routeGroceries = require('./src/grocery/grocery.routes');
const routeEvents = require('./src/event/event.routes');
const routeCategories = require('./src/category/category.routes');
const routeTags = require('./src/tag/tag.routes');

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());

app.use('/api/tasks', routeTasks, (req, res) => res.sendStatus(401));
app.use('/api/users', routeUsers, (req, res) => res.sendStatus(401));
app.use('/api/posts', routePosts, (req, res) => res.sendStatus(401));
app.use('/api/groceries', routeGroceries, (req, res) => res.sendStatus(401));
app.use('/api/events', routeEvents, (req, res) => res.sendStatus(401));
app.use('/api/categories', routeCategories, (req, res) => res.sendStatus(401));
app.use('/api/tags', routeTags, (req, res) => res.sendStatus(401));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

module.exports = app;