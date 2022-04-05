const express = require('express');
const { status } = require('express/lib/response');
const EventController = require('./event.controllers');
const router = express.Router();
const authenticate = require('../common/middlewares/authentication');

router.get('/', authenticate, EventController.getEvents);

router.get('/:id', authenticate, EventController.getEventById);

router.get('/user=:id', authenticate, EventController.getEventsByUser);

router.get('/tag=:id', authenticate, EventController.getEventsByTag);

router.post('/', authenticate, EventController.addEvent);

router.delete('/:id', authenticate, EventController.deleteEvent);

router.post('/:id', authenticate, EventController.updateEvent);

module.exports = router;
