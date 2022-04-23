const express = require('express');
const { status } = require('express/lib/response');
const TagController = require('./tag.controllers');
const router = express.Router();
const { authJwt } = require('../common/middlewares/passport');

router.get('/', authJwt, TagController.getTags);

router.get('/:id', TagController.getTagById);

router.post('/', TagController.addTag);

router.delete('/:id', TagController.deleteTag);

router.put('/:id', TagController.updateTag);

module.exports = router;