const express = require('express');
const { status } = require('express/lib/response');
const Grocery = require('../models/grocery');
const router = express.Router();

router.get('/', (req, res) => {
  Grocery.find({})
    .then(groceries => res.status(200).json(groceries))
    .catch(err => res.status(500).json({ error: err }));
});

router.post('/add', (req, res) => {
  const groceryDetails = req.body;
  const newGrocery = new Grocery(groceryDetails);

  newGrocery.save()
    .then(grocery => res.status(200).json(grocery))
    .catch(err => res.status(500).json(err));
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  Grocery.findByIdAndDelete(id)
    .then(grocery => res.status(200).json(grocery))
    .catch(err => res.status(500).json(err));
});

router.post('/update/:id', (req, res) => {
  const updatedDetails = req.body;

  Grocery.findByIdAndUpdate(req.params.id, updatedDetails)
    .then(grocery => res.status(200).json(grocery))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
