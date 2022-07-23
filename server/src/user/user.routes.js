const express = require('express');
const { status } = require('express/lib/response');
const UserController = require('./user.controllers');
const PostController = require('../post/post.controllers');
const { uploadImage } = require('../common/middlewares/image-upload');
const router = express.Router();
const { authJwt } = require('../common/middlewares/passport');

/**
* @swagger
* tags:
*   name: User Api
*   description: The User API
*/

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*           -firstName
*           -lastName
*           -emailAddress
*           -password
*           -phone
*           -accountType 
*           -source
*       properties: 
*         firstName:
*           type: string
*           description: The User's first name 
*         lastName:
*           type: string
*           description: The User's last name
*         emailAddress:
*           type: string
*           description: The User's email address
*         password:
*           type: string
*           description: The User's encrypted password
*         phone:
*           type: string
*           description: The User's phone number 
*         accountType: 
*           type: string
*           description: The User's access level
*         source:
*           type: string
*           description: The User's account origin
*       example:
*           firstName: Jean
*           lastName: Valjean
*           emailAddress: miserable@paris.com
*           password: 93qhf42%4iho^82qr#hqp9!83je31jhrqhjq3894j89j
*           phone: 0521234567
*           accountType: admin
*           source: google
*/

/**
* @swagger
* /api/users:
*   get:
*     summary: Returns all users
*     tags: [User Api]
*     responses:
*       200:
*         description: The users list
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/User'
*/
router.get('/', UserController.getUsers);

/**
* @swagger
* /api/users/{id}:
*   get:
*     summary: Returns the single user corresponding to the given id
*     tags: [User Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The user's id
*     responses:
*       200:
*         description: The user's details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.get('/:id', UserController.getUserById);

/**
* @swagger
* /api/users:
*   post:
*     summary: Add a new user
*     tags: [User Api]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.post('/', UserController.addUser);

/**
* @swagger
* /api/users/updateImage:
*   post:
*     summary: Update profile image
*     tags: [User Api]
*     requestBody:
*       required: true
*       content:
*         image/*:
*           schema:
*             type: string
*             format: binary
*     responses:
*       200:
*         description: The user before the update
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.post('/updateImage/current', authJwt, uploadImage, UserController.updateUser);

/**
* @swagger
* /api/users/{id}:
*   delete:
*     summary: Deletes the single user corresponding to the given id
*     tags: [User Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The user's id
*     responses:
*       200:
*         description: The deleted user's details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.delete('/:id', authJwt, UserController.deleteUser);

/**
* @swagger
* /api/users/{id}:
*   put:
*     summary: Updates the single user corresponding to the given id
*     tags: [User Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The user's id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The user before the update
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.put('/current', authJwt, UserController.updateUser);

/**
* @swagger
* /api/users/pickuphistory/{id}:
*   get:
*     summary: Returns the collecting history of the user corresponding to the given id
*     tags: [User Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The user's id
*     responses:
*       200:
*         description: The user's collecting history
*         content:
*           application/json:
*             type: array
*             items:
*               $ref: '#/components/schemas/PendingPost'
*/
router.get('/pickuphistory/:id', authJwt, UserController.getPickupHistory);

/**
* @swagger
* /api/users/suggested/{userid}:
*   get:
*     summary: Learns the user's activity based on his collecting history and returns recommended posts accordingly
*     tags: [User Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The user's id
*     responses:
*       200:
*         description: The user's suggested posts
*         content:
*           application/json:
*             type: array
*             items:
*               $ref: '#/components/schemas/Post'
*/
router.get('/suggested/:userid', authJwt, PostController.getSuggestedPosts);

/**
* @swagger
* /api/users/profile/{id}:
*   get:
*     summary: Returns all the profile details of the user corresponding to the given id
*     tags: [User Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The user's id
*     responses:
*       200:
*         description: The user's profile
*         content:
*           application/json:
*             schema:
*               anyOf:
*                 - $ref: '#/components/schemas/Post'
*                 - $ref: '#/components/schemas/PendingPost'
*                 - $ref: '#/components/schemas/User'
*/
router.get('/profile/:id', authJwt, UserController.getUserProfile);

/**
* @swagger
* /api/users/topusers/byrank:
*   get:
*     summary: Returns the top users sorted by rank, in an descending order
*     tags: [User Api]
*     responses:
*       200:
*         description: The users list
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/User'
*/
router.get('/topusers/byrank', UserController.getTopUsers);

module.exports = router;