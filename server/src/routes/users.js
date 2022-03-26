const express = require('express');
const { status } = require('express/lib/response');
const { MongoKerberosError } = require('mongodb');
const User = require('../models/user');
const router = express.Router();

router.get('/', (req, res) => {
  User.find({})
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: err }));
});

router.post('/add', (req, res) => {
  const userDetails = req.body;
  const newUser = new User(userDetails);

  newUser.save()
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  User.findByIdAndDelete(id)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
});

router.post('/update/:id', (req, res) => {
  const { done } = req.body;

  User.findByIdAndUpdate(req.params.id, { done })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
