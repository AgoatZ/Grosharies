const express = require('express');
const { status } = require('express/lib/response');
const PendingController = require('./pending.controllers');
const router = express.Router();

router.get('/', PendingController.getPosts);

router.get('/:id', PendingController.getPostById);

router.get('/user=:id', PendingController.getPostsByUser);

router.get('/category=:id', PendingController.getPostsByCategory);

router.get('/tag=:id', PendingController.getPostsByTag);

router.get('/collector=:id', PendingController.getPostsByCollector);

router.get('/pendings', PendingController.getAllPendingPosts);

router.get('/finished', PendingController.getAllFinishedPosts);

router.post('/', PendingController.addPending);

router.delete('/:id', PendingController.deletePost);

router.put('/:id', PendingController.updatePost);

module.exports = router;
