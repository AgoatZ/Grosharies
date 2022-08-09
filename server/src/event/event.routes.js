const express = require('express');
const { status } = require('express/lib/response');
const EventController = require('./event.controllers');
const router = express.Router();
const imageUtil = require('../common/middlewares/image-upload');
const { authJwt } = require("../common/middlewares/passport");

router.get('/', EventController.getEvents);

router.get('/:id', EventController.getEventById);

router.get('/user=:id', EventController.getEventsByUser);

router.get('/tag=:id', EventController.getEventsByTag);

router.post('/', authJwt, EventController.addEvent);

router.delete('/:id', authJwt, EventController.deleteEvent);

router.put('/:id', authJwt, EventController.updateEvent);

router.post(
    '/updateImage/:id',
    authJwt,
    imageUtil.uploadImage,
    EventController.updateEvent
);

module.exports = router;
