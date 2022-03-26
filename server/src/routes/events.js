const express = require('express');
const { status } = require('express/lib/response');
const Event = require('../models/event');
const router = express.Router();

router.get('/', (req, res) => {
  Event.find({})
    .then(events => res.status(200).json(events))
    .catch(err => res.status(500).json({ error: err }));
});

router.post('/add', (req, res) => {
  const eventDetails = req.body;
  const newEvent = new Event(eventDetails);

  newEvent.save()
    .then(event => res.status(200).json(event))
    .catch(err => res.status(500).json(err));
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  Event.findByIdAndDelete(id)
    .then(event => res.status(200).json(event))
    .catch(err => res.status(500).json(err));
});

router.post('/update/:id', (req, res) => {
  const updatedDetails = req.body;

  Event.findByIdAndUpdate(req.params.id, updatedDetails)
    .then(event => res.status(200).json(event))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
