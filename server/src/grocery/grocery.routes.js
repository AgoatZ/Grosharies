const express = require('express');
const { status } = require('express/lib/response');
const GroceryController = require('./grocery.controllers');
const router = express.Router();

router.get('/', GroceryController.getGroceries);

router.get('/:id', GroceryController.getGroceryById);

router.post('/', GroceryController.addGrocery);

router.delete('/:id', GroceryController.deleteGrocery);

router.post('/:id', GroceryController.updateGrocery);

module.exports = router;
