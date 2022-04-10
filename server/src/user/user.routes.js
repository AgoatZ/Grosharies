const express = require('express');
const { status } = require('express/lib/response');
const UserController = require('./user.controllers');
const router = express.Router();

router.get('/', UserController.getUsers);

router.get('/:id', UserController.getUserById);

router.post('/', UserController.addUser);

router.delete('/:id', UserController.deleteUser);

router.put('/:id', UserController.updateUser);

router.get('/pickuphistory/:id', UserController.getPickupHistory);

module.exports = router;
