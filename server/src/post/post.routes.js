const express = require("express");
const { status } = require("express/lib/response");
const PostController = require("./post.controllers");
const imageUtil = require("../common/middlewares/image-upload");
const router = express.Router();
const { authJwt } = require("../common/middlewares/passport");

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
