const express = require('express');
const { status } = require('express/lib/response');
const CategoryController = require('./category.controllers');
const router = express.Router();

router.get('/', CategoryController.getCategory);

router.get('/:id', CategoryController.getCategoryById);

router.post('/', CategoryController.addCategory);

router.delete('/:id', CategoryController.deleteCategory);

router.put('/:id', CategoryController.updateCategory);

module.exports = router;
