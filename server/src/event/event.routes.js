const express = require('express');
const { status } = require('express/lib/response');
const EventController = require('./event.controllers');
const router = express.Router();

router.get('/', EventController.getEvents);

router.get('/:id', EventController.getEventById);

router.post('/', EventController.addEvent);

router.delete('/:id', EventController.deleteEvent);

router.post('/:id', EventController.updateEvent);

module.exports = router;
