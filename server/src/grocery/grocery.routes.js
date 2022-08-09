const express = require('express');
const { status } = require('express/lib/response');
const GroceryController = require('./grocery.controllers');
const router = express.Router();
const uploadUtil = require('../common/middlewares/image-upload');
const { authJwt } = require('../common/middlewares/passport');
/**
* @swagger
* tags:
*   name: Grocery Api
*   description: The Grocery API
*/

/**
* @swagger
* components:
*   schemas:
*     Grocery:
*       type: object
*       required:
*           -name
*           -amount
*           -scale
*           -category
*           -images
*       properties: 
*         name:
*           type: string
*           description: The Grocery's name 
*         amount:
*           type: number
*           description: The Groceries traffic amount
*         scale:
*           type: string
*           description: The Grocery's scaling unit
*         category:
*           type: string
*           description: The Grocery's categoryId
*         images:
*           type: string
*           description: The Grocery's image in base64
*       example:
*           name: Tomatoes
*           amount: 666
*           scale: kg
*           category: 12q3f42564ho^82qr#hqp9!83je31jhrqhjq3894j89j
*           images: 12q3f42564ho^82qr#hqp9!83je31jhrqhjq3894j89j12q3f42564ho^82qr#hqp9!83je31jhrqhjq3894j89j12q3f42564ho^82qr#hqp9!83je31jhrqhjq3894j89j
*/

/**
* @swagger
* /api/groceries:
*   get:
*     summary: Returns all groceries
*     tags: [Grocery Api]
*     responses:
*       200:
*         description: The groceries list
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Grocery'
*/
router.get('/', GroceryController.getGroceries);

/**
* @swagger
* /api/groceries/{id}:
*   get:
*     summary: Returns the single grocery corresponding to the given id
*     tags: [Grocery Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The grocery's id
*     responses:
*       200:
*         description: The grocery's details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Grocery'
*/
router.get('/:id', GroceryController.getGroceryById);

/**
* @swagger
* /api/groceries/name/{name}:
*   get:
*     summary: Returns the single grocery corresponding to the given name
*     tags: [Grocery Api]
*     parameters:
*       - in: path
*         name: name
*         schema:
*           type: string
*         required: true
*         description: The grocery's name
*     responses:
*       200:
*         description: The grocery's details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Grocery'
*/
router.get('/name/:name', GroceryController.getGroceryByName);

/**
* @swagger
* /api/groceries/search/{search}:
*   get:
*     summary: Returns all the groceries corresponding to the given search query
*     tags: [Grocery Api]
*     parameters:
*       - in: path
*         name: search
*         schema:
*           type: string
*         required: true
*         description: The search query
*     responses:
*       200:
*         description: The groceries details
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Grocery'
*/
router.get('/search/:search', GroceryController.searchGrocery);

/**
* @swagger
* /api/groceries:
*   post:
*     summary: Add a new grocery
*     tags: [Grocery Api]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Grocery'
*     responses:
*       200:
*         description: The new grocery
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Grocery'
*/
router.post('/', authJwt, GroceryController.addGrocery);

/**
* @swagger
* /api/groceries/{id}:
*   delete:
*     summary: Deletes the single grocery corresponding to the given id
*     tags: [Grocery Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The grocery's id
*     responses:
*       200:
*         description: The deleted grocery's details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Grocery'
*/
router.delete('/:id', authJwt, GroceryController.deleteGrocery);

/**
* @swagger
* /api/groceries/{id}:
*   put:
*     summary: Updates the single grocery corresponding to the given id
*     tags: [Grocery Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The grocery's id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Grocery'
*     responses:
*       200:
*         description: The grocery before the update
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Grocery'
*/
router.put('/:id', authJwt, GroceryController.updateGrocery);

/**
* @swagger
* /api/groceries/updateImage/{id}:
*   post:
*     summary: Update grocery image
*     tags: [Grocery Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The grocery's id
*     requestBody:
*       required: true
*       content:
*         image/*:
*           schema:
*             type: string
*             format: binary
*     responses:
*       200:
*         description: The grocery before the update
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Grocery'
*/
router.post('/updateImage/:id', authJwt, uploadUtil.uploadImage, GroceryController.updateGrocery);

module.exports = router;
