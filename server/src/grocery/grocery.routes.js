const express = require('express');
const { status } = require('express/lib/response');
const GroceryController = require('./grocery.controllers');
const router = express.Router();

router.get('/', GroceryController.getGroceries);

router.get('/:id', GroceryController.getGroceryById);

router.get('/name=:name', GroceryController.getGroceryByName);

router.post('/', GroceryController.addGrocery);

router.delete('/:id', GroceryController.deleteGrocery);

router.put('/:id', GroceryController.updateGrocery);

module.exports = router;
