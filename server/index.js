const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const routeTasks = require('./src/routes/tasks');
const routeUsers = require('./src/routes/users');
const routePosts = require('./src/routes/posts');
const routeGroceries = require('./src/routes/groceries');
const routeEvents = require('./src/routes/events');
const routeCategories = require('./src/routes/categories');

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());

app.use('/api/tasks', routeTasks, (req, res) => res.sendStatus(401));
app.use('/api/users', routeUsers, (req, res) => res.sendStatus(401));
app.use('/api/posts', routePosts, (req, res) => res.sendStatus(401));
app.use('/api/groceries', routeGroceries, (req, res) => res.sendStatus(401));
app.use('/api/events', routeEvents, (req, res) => res.sendStatus(401));
app.use('/api/categories', routeCategories, (req, res) => res.sendStatus(401));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server is running \nlistening on port ${port}...`);
