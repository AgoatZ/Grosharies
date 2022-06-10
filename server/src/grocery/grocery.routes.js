const express = require('express');
const { status } = require('express/lib/response');
const GroceryController = require('./grocery.controllers');
const router = express.Router();
const uploadUtil = require('../common/middlewares/image-upload');

router.get('/', GroceryController.getGroceries);

router.get('/:id', GroceryController.getGroceryById);

router.get('/name/:name', GroceryController.getGroceryByName);

router.get('/search/:search', GroceryController.searchGrocery);

router.post('/', GroceryController.addGrocery);

router.delete('/:id', GroceryController.deleteGrocery);

router.put('/:id', GroceryController.updateGrocery);

router.post('/updateImage/:id', uploadUtil.uploadImage, GroceryController.updateGrocery);

module.exports = router;
