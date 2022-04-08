const express = require('express');
const { status } = require('express/lib/response');
const EventController = require('./event.controllers');
const router = express.Router();
const authenticate = require('../common/middlewares/authentication');

router.get('/', authenticate, EventController.getEvents);

router.get('/:id', EventController.getEventById);

router.get('/user=:id', EventController.getEventsByUser);

router.get('/tag=:id', EventController.getEventsByTag);

router.post('/', EventController.addEvent);

router.delete('/:id', EventController.deleteEvent);

router.put('/:id', EventController.updateEvent);

module.exports = router;
