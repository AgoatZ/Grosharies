const express = require('express');
const { status } = require('express/lib/response');
const Category = require('../models/category');
const router = express.Router();

router.get('/', (req, res) => {
  Category.find({})
    .then(categories => res.status(200).json(categories))
    .catch(err => res.status(500).json({ error: err }));
});

router.post('/add', (req, res) => {
  const categoryDetails = req.body;
  const newCategory = new Category(categoryDetails);

  newCategory.save()
    .then(category => res.status(200).json(category))
    .catch(err => res.status(500).json(err));
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  Category.findByIdAndDelete(id)
    .then(category => res.status(200).json(category))
    .catch(err => res.status(500).json(err));
});

router.post('/update/:id', (req, res) => {
  const updatedDetails = req.body;

  Category.findByIdAndUpdate(req.params.id, updatedDetails)
    .then(category => res.status(200).json(category))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
