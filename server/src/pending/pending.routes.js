const express = require("express");
const PendingController = require("./pending.controllers");

const { authJwt } = require("../common/middlewares/passport");

const router = express.Router();

router.get("/", PendingController.getPendings);

router.get("/grouped", authJwt, PendingController.getGroupedPendings);

router.get("/:id", authJwt, PendingController.getPendingById);

router.get("/post/:id", authJwt, PendingController.getPendingsByPost);

router.get("/publisher/:id", authJwt, PendingController.getPendingsByPublisher);

router.get("/category/:id", authJwt, PendingController.getPendingsByCategory);

router.get("/tag/:id", authJwt, PendingController.getPendingsByTag);

router.get("/collector/:id", authJwt, PendingController.getPendingsByCollector);

router.get("/pendings", authJwt, PendingController.getAllPendingPosts);

router.get("/finished", authJwt, PendingController.getAllFinishedPosts);

router.get("/cancelled", authJwt, PendingController.getAllCancelledPosts);

router.post("/", authJwt, PendingController.addPending);

router.post("/finish/:id", authJwt, PendingController.finishPending);

router.post("/collector/finish/:id", authJwt, PendingController.setCollectorStatement);

router.post("/cancel/:id", authJwt, PendingController.cancelPending);

router.delete("/:id", authJwt, PendingController.deletePending);

router.put("/:id", authJwt, PendingController.updatePending);

module.exports = router;
