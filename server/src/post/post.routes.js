const express = require("express");
const { status } = require("express/lib/response");
const PostController = require("./post.controllers");
const imageUtil = require("../common/middlewares/image-upload");
const router = express.Router();
const { authJwt } = require("../common/middlewares/passport");

/**
* @swagger
* tags:
*   name: Post Api
*   description: The Post API
*/

/**
* @swagger
* components:
*   schemas:
*     Post:
*       type: object
*       required:
*           -headline
*           -address
*       properties: 
*         headline:
*           type: string
*           description: The Post's headline
*         userId:
*           type: string
*           description: The publisher's Id
*         address:
*           type: string
*           description: The address relevant to the post
*         addressCoordinates:
*           $ref: '#/components/definitions/AddressCoordinates'
*           description: The Coordinates of the address
*         publishingDate:
*           type: string
*           format: date-time
*           description: The date when the post was published
*         pickUpDates: 
*           $ref: '#/components/definitions/PickUpDates'
*           description: The dates available for pick up
*         status:
*           type: string
*           enum: [still there, collected, partially collected, cancelled]
*           description: The User's account origin
*         tags:
*           type: array
*           items:
*               $ref: '#/components/schemas/Tag'
*           description: The tags of the post
*         content:
*           type: array
*           items:
*             $ref: '#/components/definitions/Content'
*           description: The groceries and how much is left of them
*         description:
*           type: string
*           description: Free text by the user
*         images:
*           type: array
*           items:
*             type: string
*           description: The post's images
*         videos:
*           type: array
*           items:
*             type: string
*           description: The post's videos
*         repliers:
*           type: array
*           items:
*             $ref: '#/components/definitions/Repliers'
*             description: The post's pending posts ids and the requesting users ids
*       example:
*           headline: Come and take some Fresh Fruits!
*           userId: 93qhf42%4iho^82qr#hqp9!83je31jhrqhjq3894j89j
*           address: 37 King George, Tel Aviv
*           addressCoordinates:
*             lat: 32.12
*             lng: 34.21
*           publishingDate: 2022-06-12T17:25:17.480+00:00
*           pickUpDates: [
*             repeated: false,
*             from: 2022-06-12T17:25:16.773+00:00,
*             until: 2022-06-13T17:25:16.773+00:00
*             ]
*           status: collected
*           content: [{
*             original: {
*               images: /9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoGCBUTExcTExUXFRcYGhgXGhkaGBgaGRcYGxoZGRsZGhwcICsjGxwpIRoZJDUlKCwuMjIyGSE3PDcxO,
*               name: Lindt Lindor,
*               amount: 39,
*               scale: kg,
*               packing: none,
*               category: 62333336378d7371318b5c0f2
*             },
*             left: 39
*           }]
*           description: Zu verschenken! Wir ziehen aus und alles muss weg. Da gibt es Arbeitsmittel aber sehr lecker Essen auch!
*           repliers: [{ user: BAQAAAQABAAD/2wCEAAoGCBUTEx, reply: BAQAA6543AAD/2wCEAAoG123456}]
*   definitions:
*     AddressCoordinates:
*       type: object
*       required:
*         -lat
*         -lng
*       properties: 
*         lat:
*           type: number
*           description: The address latitude
*         lng:
*           type: number
*           description: The address longtitude
*     Content:
*       type: object
*       required:
*         -original
*         -left
*       properties:
*         original:
*           $ref: '#/components/schemas/Grocery'
*           description: The grocery with all the details and the original amount
*         left:
*           type: number
*           description: How much is left of the grocery
*     Repliers:
*       type: object
*       required:
*         -user
*         -reply
*       properties:
*         user:
*           type: string
*           description: The requesting user's id
*         reply:
*           type: string
*           description: The pending post's id
*     PickUpDates:
*       type: object
*       required:
*         -from
*         -until
*         -required
*       properties:
*         from:
*           type: string
*           format: date-time
*           description: The time since which one can come and pick up the goods
*         until:
*           type: string
*           format: date-time
*           description: The time until which one can come and pick up the goods
*         repeated:
*           type: boolean
*           description: Indicates if picking hours repeat throughout the picking days
*     PendPostResponse:
*       type: object
*       properties:
*         post:
*           $ref: '#/components/schemas/Post'
*           description: the updated post
*         pending:
*           $ref: '#/components/schemas/PendingPost'
*           description: the new PendingPost document
*     PendPostRequest:
*       type: object
*       properties:
*         postId:
*           type: string
*           description: The post's id to make a new PendingPost from
*         groceries:
*           type: array
*           items:
*             $ref: '#/components/schemas/Grocery'
*/

/**
* @swagger
* /api/posts:
*   get:
*     summary: Returns all posts
*     tags: [Post Api]
*     responses:
*       200:
*         description: The posts list
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*/
router.get("/", PostController.getPosts);

/**
* @swagger
* /api/posts/{id}:
*   get:
*     summary: Returns the single post corresponding to the given id
*     tags: [Post Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The post's id
*     responses:
*       200:
*         description: The post's details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*/
router.get("/:id", PostController.getPostById);

/**
* @swagger
* /api/posts/user/{id}:
*   get:
*     summary: Returns all the posts published by the user
*     tags: [Post Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The publisher's id
*     responses:
*       200:
*         description: The posts details
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*/
router.get("/user/:id", authJwt, PostController.getPostsByUser);

/**
* @swagger
* /api/posts/openPosts/{id}:
*   get:
*     summary: Returns all the available-to-pick-from posts published by the user
*     tags: [Post Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The publisher's id
*     responses:
*       200:
*         description: The posts details
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*/
router.get("/openPosts/:id", authJwt, PostController.getPublisherOpenPosts);

/**
* @swagger
* /api/posts/images/{id}:
*   get:
*     summary: Returns all the images of the post
*     tags: [Post Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The post's id
*     responses:
*       200:
*         description: The posts images
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: string
*/
router.get("/images/:id", PostController.getPostImages);

/**
* @swagger
* /api/posts/category/{id}:
*   get:
*     summary: Returns all the posts with groceries in the given category
*     tags: [Post Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The category's id
*     responses:
*       200:
*         description: The posts details
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*/
router.get("/category/:id", PostController.getPostsByCategory);

/**
* @swagger
* /api/posts/tag/{id}:
*   get:
*     summary: Returns all the posts with the given tag
*     tags: [Post Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The tag's id
*     responses:
*       200:
*         description: The posts details
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*/
router.get("/tag/:id", PostController.getPostsByTag);

/**
* @swagger
* /api/posts/collector/{id}:
*   get:
*     summary: Returns all the posts wanted by the user
*     tags: [Post Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The collector's id
*     responses:
*       200:
*         description: The posts details
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*/
router.get("/collector/:id", authJwt, PostController.getPostsByCollector);

/**
* @swagger
* /api/posts/search/{search}:
*   get:
*     summary: Returns all the posts corresponding to the given search query
*     tags: [Post Api]
*     parameters:
*       - in: path
*         name: search
*         schema:
*           type: string
*         required: true
*         description: The search query
*     responses:
*       200:
*         description: The posts details
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*/
router.get("/search/:search", PostController.searchPosts);

/**
* @swagger
* /api/posts/suggested/{userid}:
*   get:
*     summary: Learns the user's activity based on his collecting history and returns recommended posts accordingly
*     tags: [Post Api]
*     parameters:
*       - in: path
*         name: userid
*         schema:
*           type: string
*         required: true
*         description: The user's id
*     responses:
*       200:
*         description: The posts details
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*/
router.get("/suggested/:userid", authJwt, PostController.getSuggestedPosts);

/**
* @swagger
* /api/posts/nearby:
*   post:
*     summary: Returns posts that are within a radius of 100 Km of the user
*     tags: [Post Api]
*     responses:
*       200:
*         description: The posts details
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*/
router.post("/nearby", authJwt, PostController.getNearbyPosts);

/**
* @swagger
* /api/posts/updateImage/{id}:
*   post:
*     summary: Update post image
*     tags: [Post Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The post's id
*     requestBody:
*       required: true
*       content:
*         image/*:
*           schema:
*             type: string
*             format: binary
*     responses:
*       200:
*         description: The post before the update
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*/
router.post(
  "/updateImage/:id",
  authJwt,
  imageUtil.uploadImage,
  PostController.updatePost
);

/**
* @swagger
* /api/posts/bygroceries:
*   post:
*     summary: Return all posts containing at least one of the given groceries
*     tags: [Post Api]
*     requestBody:
*       required: true
*       content:
*         schema:
*           type: array
*           items:
*             type: string
*             description: The names of the groceries
*     responses:
*       200:
*         description: The posts details
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*/
router.post("/bygroceries", PostController.getPostsByGroceries);

/**
* @swagger
* /api/posts:
*   post:
*     summary: Add a new post
*     tags: [Post Api]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Post'
*     responses:
*       200:
*         description: The new post
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*/
router.post("/", authJwt, PostController.addPost);

/**
* @swagger
* /api/posts/pend:
*   post:
*     summary: Creates a PendingPost document and updates the original post content with new amounts in all the relevant "left" properties
*     tags: [Post Api]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/definitions/PendPostRequest'
*     responses:
*       200:
*         description: The updated post's details and the new PendingPost document
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/definitions/PendPostResponse'
*/
router.post("/pend", authJwt, PostController.pendPost);

/**
* @swagger
* /api/posts/{id}:
*   delete:
*     summary: Safe Deletes the single post corresponding to the given id, cancelling all still pending PendingPosts
*     tags: [Post Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The post's id
*     responses:
*       200:
*         description: The deleted post's details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*/
router.delete("/:id", authJwt, PostController.deletePost);

/**
* @swagger
* /api/posts/{id}:
*   put:
*     summary: Updates the single post corresponding to the given id
*     tags: [Post Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The post's id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Post'
*     responses:
*       200:
*         description: The post before the update
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Post'
*/
router.put("/:id", authJwt, PostController.updatePost);

module.exports = router;
