const express = require("express");
const PendingController = require("./pending.controllers");

const { authJwt } = require("../common/middlewares/passport");

const router = express.Router();

router.get("/", PendingController.getPendings);

router.get("/grouped", PendingController.getGroupedPendings);

router.get("/:id", PendingController.getPendingById);

router.get("/post/:id", PendingController.getPendingsByPost);

router.get("/publisher/:id", authJwt, PendingController.getPendingsByPublisher);

router.get("/category/:id", PendingController.getPendingsByCategory);

router.get("/tag/:id", PendingController.getPendingsByTag);

router.get("/collector/:id", authJwt, PendingController.getPendingsByCollector);

router.get("/pendings", PendingController.getAllPendingPosts);

router.get("/finished", PendingController.getAllFinishedPosts);

router.get("/cancelled", PendingController.getAllCancelledPosts);

router.post("/", authJwt, PendingController.addPending);

router.post("/finish/:id", authJwt, PendingController.finishPending);

router.get('/checkandupdatepending/id', PendingController.decide);

router.post("/collector/finish/:id", authJwt, PendingController.setCollectorStatement);

router.post("/cancel/:id", authJwt, PendingController.cancelPending);

router.delete("/:id", authJwt, PendingController.deletePending);

router.put("/:id", authJwt, PendingController.updatePending);

module.exports = router;
