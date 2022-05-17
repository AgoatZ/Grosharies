const express = require('express');
const { status } = require('express/lib/response');
const PendingController = require('./pending.controllers');
const passport = require('../common/middlewares/passport');
const router = express.Router();

router.get('/', PendingController.getPendings);

router.get('/grouped', PendingController.getGroupedPendings);

router.get('/:id', PendingController.getPendingById);

router.get('/publisher/:id', passport.authJwt, PendingController.getPendingsByPublisher);

router.get('/category/:id', PendingController.getPendingsByCategory);

router.get('/tag/:id', PendingController.getPendingsByTag);

router.get('/collector/:id', PendingController.getPendingsByCollector);

router.get('/pendings', PendingController.getAllPendingPosts);

router.get('/finished', PendingController.getAllFinishedPosts);

router.get('/cancelled', PendingController.getAllCancelledPosts);

router.post('/', PendingController.addPending);

router.post('/finish/:id', PendingController.finishPending);

router.post('/cancel/:id', PendingController.cancelPending);

router.delete('/:id', PendingController.deletePending);

router.put('/:id', PendingController.updatePending);

module.exports = router;
