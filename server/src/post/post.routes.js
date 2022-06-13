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
*           -userId
*           -address
*           -addressCoordinates
*           -publishingDate
*           -pickUpDates
*           -status
*           -tags
*           -content
*           -description
*           -images
*           -videos
*           -repliers
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
*           $ref: '#/components/schemas/AddressCoordinates'
*           description: The Coordinates of the address
*         publishingDate:
*           type: string
*           format: date-time
*           description: The date when the post was published
*         pickUpDates: 
*           $ref: '#/components/schemas/AddressCoordinates'
*           description: The dates available for pick up
*         status:
*           type: string
*           enum: [still there, collected, partially collected, cancelled]
*           description: The User's account origin
*         tags:
*           type: array
*             items:
*               $ref: '#/components/schemas/Tag'
*           description: The tags of the post
*         content:
*           type: array
*           items:
*             $ref: '#/components/schemas/Content'
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
*             type: $ref: '#/components/schemas/Repliers'
*           description: The post's pending posts ids and the requesting users ids
*       example:
*           headline: Come and take some Fresh Fruits!
*           userId: 93qhf42%4iho^82qr#hqp9!83je31jhrqhjq3894j89j
*           address: 37 King George, Tel Aviv
*           addressCoordinates: { lat: 32.12, lng: 34.21 }
*           publishingDate: 2022-06-12T17:25:17.480+00:00
*           pickUpDates: [{ repeated: false, from: 2022-06-12T17:25:16.773+00:00, until: 2022-06-13T17:25:16.773+00:00}]
*           status: collected
*           content: [{
*             original: {
*               images: /9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoGCBUTExcTExUXFRcYGhgXGhkaGBgaGRcYGxoZGRsZGhwcICsjGxwpIRoZJDUlKCwuMjIyGSE3PDcxO,
*               name: Lindt Lindor,
*               amount: 39,
*               scale: kg,
*               packing: none
*               category: 62333336378d7371318b5c0f2
*             }
*             left: 39
*           }]
*           description: Zu verschenken! Wir ziehen aus und alles muss weg. Da gibt es Arbeitsmittel aber sehr lecker Essen auch!
*           repliers: [{ user: BAQAAAQABAAD/2wCEAAoGCBUTEx, reply: BAQAA6543AAD/2wCEAAoG123456}]
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
*           description: The requestin user's id
*         reply:
*           type: string
*           description: The pending post's id
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

router.get("/:id", authJwt, PostController.getPostById);

router.get("/user/:id", authJwt, PostController.getPostsByUser);

router.get("/openPosts/:id", authJwt, PostController.getPublisherOpenPosts);

router.get("/category/:id", authJwt, PostController.getPostsByCategory);

router.get("/tag/:id", authJwt, PostController.getPostsByTag);

router.get("/collector/:id", authJwt, PostController.getPostsByCollector);

router.get("/search/:search", authJwt, PostController.searchPosts);

router.get("/suggested/:userid", authJwt, PostController.getSuggestedPosts);

router.post("/nearby", authJwt, PostController.getNearbyPosts);

router.post(
  "/updateImage/:id",
  authJwt,
  imageUtil.uploadImage,
  PostController.updatePost
);

router.post("/bygroceries", PostController.getPostsByGroceries);

router.post("/", authJwt, PostController.addPost);

router.post("/pend", authJwt, PostController.pendPost);

router.delete("/:id", PostController.deletePost);

router.put("/:id", PostController.updatePost);

module.exports = router;
