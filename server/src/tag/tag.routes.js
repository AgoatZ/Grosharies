const express = require('express');
const { status } = require('express/lib/response');
const TagController = require('./tag.controllers');
const router = express.Router();
const { authJwt } = require('../common/middlewares/passport');

router.get('/', authJwt, TagController.getTags);

router.get('/:id', authJwt, TagController.getTagById);

router.post('/', authJwt, TagController.addTag);

router.delete('/:id', authJwt, TagController.deleteTag);

router.put('/:id', authJwt, TagController.updateTag);

module.exports = router;
