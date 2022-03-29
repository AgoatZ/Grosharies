const express = require('express');
const { status } = require('express/lib/response');
const TagController = require('./tag.controllers');
const router = express.Router();

router.get('/', TagController.getTags);

router.get('/:id', TagController.getTagById);

router.post('/', TagController.addTag);

router.delete('/:id', TagController.deleteTag);

router.post('/:id', TagController.updateTag);

module.exports = router;
