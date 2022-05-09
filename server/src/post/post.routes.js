const express = require('express');
const { status } = require('express/lib/response');
const PostController = require('./post.controllers');
const router = express.Router();

router.get('/', PostController.getPosts);

router.get('/:id', PostController.getPostById);

router.get('/user=:id', PostController.getPostsByUser);

router.get('/category=:id', PostController.getPostsByCategory);

router.get('/tag=:id', PostController.getPostsByTag);

router.get('/collector=:id', PostController.getPostsByCollector);

router.get('/suggested/:userid', PostController.getSuggestedPosts);

router.post('/updateImage/:id', PostController.updateImage);

router.post('/bygroceries', PostController.getPostsByGroceries);

router.post('/', PostController.addPost);

router.post('/pend', PostController.pendPost);

router.delete('/:id', PostController.deletePost);

router.put('/:id', PostController.updatePost);

module.exports = router;
