const express = require('express');
const { status } = require('express/lib/response');
const Task = require('../models/task');
const router = express.Router();

router.get('/', (req, res) => {
  Task.find({})
    .then(tasks => res.status(200).json(tasks))
    .catch(err => res.status(500).json({ error: err }));
});

router.post('/add', (req, res) => {
  const { title } = req.body;
  const newTask = new Task({ title });

  newTask.save()
    .then(task => res.status(200).json(task))
    .catch(err => res.status(500).json(err));
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  Task.findByIdAndDelete(id)
    .then(task => res.status(200).json(task))
    .catch(err => res.status(500).json(err));
});

router.post('/update/:id', (req, res) => {
  const { done } = req.body;
  Task.findByIdAndUpdate(req.params.id, { done })
    .then(task => res.status(200).json(task))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
