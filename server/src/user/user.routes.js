const express = require('express');
const { status } = require('express/lib/response');
const UserController = require('./user.controllers');
const PostController = require('../post/post.controllers');
const imageUtil = require('../common/middlewares/image-upload');
const router = express.Router();

router.get('/', UserController.getUsers);

router.get('/:id', UserController.getUserById);

router.post('/', UserController.addUser);

router.post('/updateImage/:id', imageUtil.uploadImage, UserController.updateUser);

router.delete('/:id', UserController.deleteUser);

router.put('/:id', UserController.updateUser);

router.get('/pickuphistory/:id', UserController.getPickupHistory);

router.get('/suggested/:userid', PostController.getSuggestedPosts);

module.exports = router;
