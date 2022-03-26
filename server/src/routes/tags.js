const express = require('express');
const { status } = require('express/lib/response');
const Tag = require('../models/tag');
const router = express.Router();

router.get('/', (req, res) => {
  Tag.find({})
    .then(tags => res.status(200).json(tags))
    .catch(err => res.status(500).json({ error: err }));
});

router.post('/add', (req, res) => {
  const tagDetails = req.body;
  const newTag = new Tag(tagDetails);

  newTag.save()
    .then(tag => res.status(200).json(tag))
    .catch(err => res.status(500).json(err));
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  Tag.findByIdAndDelete(id)
    .then(tag => res.status(200).json(tag))
    .catch(err => res.status(500).json(err));
});

router.post('/update/:id', (req, res) => {
  const updatedDetails = req.body;

  Tag.findByIdAndUpdate(req.params.id, updatedDetails)
    .then(tag => res.status(200).json(tag))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
