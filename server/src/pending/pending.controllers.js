const PendingService = require('./pending.services');
const UserService = require('../user/user.services');
const Status = require('../enums/pending-status');

const getPendings = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 10;
    try {
        const posts = await PendingService.getPendings({}, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getPendings: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getGroupedPendings = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 10;
    try {
        const { pendingPosts, finishedPendings, cancelledPendings } = await PendingService.getGroupedPendings(page, limit);
        return res.status(200).json({ pendingPosts: pendingPosts, finishedPendings: finishedPendings, cancelledPendings: cancelledPendings, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getGroupedPendings: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPendingById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const post = await PendingService.getPendingById(req.params.id);
        return res.status(200).json({ post: post, message: "Succesfully Post Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getPendingById: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPendingsByCategory = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const posts = await PendingService.getPendingsByCategory(req.params.id, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getPendingsByCategory: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPendingsByTag = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const posts = await PendingService.getPendingsByTag(req.params.id, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getPendingsByTag: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPendingsByCollector = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const { pendingPosts, finishedPendings, cancelledPendings } = await PendingService.getPendingsByCollector(req.params.id, req.user, page, limit);
        return res.status(200).json({ pendingPosts: pendingPosts, finishedPendings: finishedPendings, cancelledPendings: cancelledPendings, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getPendingsByCollector: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPendingsByPublisher = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const { pendingPosts, finishedPendings, cancelledPendings } = await PendingService.getPendingsByPublisher(req.params.id, req.user, page, limit);
        return res.status(200).json({ pendingPosts: pendingPosts, finishedPendings: finishedPendings, cancelledPendings: cancelledPendings, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getPendingsByUser: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getAllPendingPosts = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const posts = await PendingService.getAllPendingPosts(page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getAllPendingPosts: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getAllFinishedPosts = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const posts = await PendingService.getAllFinishedPosts(page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getAllFinishedPosts: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getAllCancelledPosts = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const posts = await PendingService.getAllCancelledPosts(page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getAllCancelledPosts: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const addPending = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const { emitEvent } = require(".././../index");
        const pendingPost = await PendingService.addPending(req.body);
        const collector = await UserService.getUserById(pendingPost.collectorId);
        const publisher = await UserService.getUserById(pendingPost.publisherId);

        const newNotification = {
            text: pendingPost.headline,
            title: "A new order by " + collector.firstName + " " + collector.lastName,
            postId: pendingPost.sourcePost
        };
        emitEvent('New Notification', publisher._id, newNotification);
        publisher.notifications.push(newNotification);
        await UserService.updateUser(publisher._id, { notifications: publisher.notifications });
        return res.status(200).json({ post: pendingPost, message: "Succesfully Pending Added" });
    } catch (e) {
        console.log('Pending controller error from addPending: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const deletePending = async function (req, res, next) {
    try {
        const post = await PendingService.deletePending(req.params.id);
        return res.status(200).json({ post: post, message: "Succesfully Posts Deleted" });
    } catch (e) {
        console.log('Pending controller error from deletePending: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
}

const updatePending = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const { emitEvent, broadcastEvent } = require(".././../index");

        const oldPost = await PendingService.updatePending(req.params.id, req.body);
        const collector = await UserService.getUserById(oldPost.collectorId);
        const publisher = await UserService.getUserById(oldPost.publisherId);
        const newNotification = {
            text: oldPost.headline,
            title: "An order was edited by " + collector.firstName + " " + collector.lastName,
            postId: oldPost.sourcePost
        };
        const publisherNote = {
            pendingPostId: pendingPost._id,
            sourcePostId: updatePost._id,
            collectorId: pendingPost.collectorId,
            publisherId: updatedPost.userId
        };
        emitEvent('Pending Edited', publisher._id, publisherNote);
        emitEvent('New Notification', publisher._id, newNotification);

        await UserService.addToNotifications(publisher._id, [publisherNote, newNotification]);
        return res.status(200).json({ oldPost: oldPost, message: "Succesfully Post Updated" });
    } catch (e) {
        console.log('Pending controller error from updatePending: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const setCollectorStatement = async function (req, res, next) {
    try {
        const { emitEvent } = require(".././../index");

        const oldPending = await PendingService.setCollectorStatement(req.params.id, req.user);
        const collector = await UserService.getUserById(oldPending.collectorId);
        const publisher = await UserService.getUserById(oldPending.publisherId);

        const noteToPublisher = {
            text: oldPending.headline,
            title: "A collection was stated by " + collector.firstName + " " + collector.lastName,
            postId: oldPending.sourcePost
        };
        emitEvent('New Notification', oldPending.publisherId, noteToPublisher);
        publisher.notifications.push(noteToPublisher);
        await UserService.addToNotifications(publisher._id, noteToPublisher);

        const statusChanged = { by: collector._id, pendingPostId: oldPending._id, sourcePostId: oldPending.sourcePost, collectorId: collector._id, publisherId: publisher._id };
        emitEvent("Pending Status Changed", publisher._id, statusChanged);
        emitEvent("Pending Status Changed", collector._id, statusChanged);
        await UserService.addToNotifications(publisher._id, statusChanged);
        await UserService.addToNotifications(collector._id, statusChanged);

        return res.status(200).json({ oldPending: oldPending, message: "Succesfully Post Updated" });
    } catch (e) {
        console.log('Pending service error from setCollectorStatement: ', e.message);

        throw Error('Error while changing statement Posts');
    }
    //TODO: Add relevant notification
};

const finishPending = async function (req, res, next) {
    try {
        console.log('Enterred finishPending Controller')
        const { emitEvent } = require(".././../index");

        const { finishedPending, trafficGroceries } = await PendingService.finishPending(req.params.id, req.user);
        const collector = await UserService.getUserById(finishedPending.collectorId);
        const publisher = await UserService.getUserById(finishedPending.publisherId);
        let byWho;

        if (req.user && String(req.user._id) === String(finishedPending.publisherId)) {
            const wasCompleted = {
                text: finishedPending.headline,
                title: "An order was completed",
                postId: finishedPending.sourcePost
            };
            const pendingComplete = {
                pendingPostId: finishedPending._id
            };
            emitEvent('New Notification', finishedPending.publisherId, wasCompleted);
            publisher.notifications.push(wasCompleted);
            byWho = publisher._id;
        } else {
            byWho = "system";
        }
        const orderComplete = {
            text: finishedPending.headline,
            title: "Your order is completed",
            postId: finishedPending.sourcePost
        };
        emitEvent('New Notification', finishedPending.collectorId, orderComplete);
        collector.notifications.push(orderComplete);
        await UserService.updateUser(collector._id, { notifications: collector.notifications });
        await UserService.updateUser(publisher._id, { notifications: publisher.notifications });

        const statusChanged = { by: byWho, pendingPostId: oldPending._id, sourcePostId: oldPending.sourcePost, collectorId: collector._id, publisherId: publisher._id };
        emitEvent("Pending Status Changed", publisher._id, statusChanged);
        emitEvent("Pending Status Changed", collector._id, statusChanged);
        await UserService.addToNotifications(publisher._id, statusChanged);
        await UserService.addToNotifications(collector._id, statusChanged);

        return res.status(200).json({ post: finishedPending, groceries: trafficGroceries, message: "Succesfully Pending Post Finished" });
    } catch (e) {
        console.log('Pending controller error from finishPending: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const cancelPending = async function (req, res, next) {
    try {
        const { emitEvent } = require(".././../index");

        const { cancelledPost, updatedPost } = await PendingService.cancelPending(req.params.id, req.user);
        const collector = await UserService.getUserById(cancelledPost.collectorId);
        const publisher = await UserService.getUserById(cancelledPost.publisherId);
        let byWho;

        if (req.user && String(req.user._id) === String(cancelledPost.collectorId)) {
            const completedBy = {
                text: cancelledPost.headline,
                title: "An order was cancelled by " + collector.firstName + " " + collector.lastName,
                postId: cancelledPost.sourcePost
            };
            emitEvent('New Notification', cancelledPost.publisherId, completedBy);
            await UserService.addToNotifications(publisher._id, completedBy);
            byWho = collector._id;
        } else if (req.user && String(req.user._id) === String(cancelledPost.publisherId)) {
            const wasCompleted = {
                text: cancelledPost.headline,
                title: "An order was cancelled",
                postId: cancelledPost.sourcePost
            };
            emitEvent('New Notification', cancelledPost.publisherId, wasCompleted);
            await UserService.addToNotifications(publisher._id, wasCompleted);
            byWho = publisher._id;
        } else {
            byWho = "system";
        }
        const orderComplete = {
            text: cancelledPost.headline,
            title: "Your order is Cancelled",
            postId: cancelledPost.sourcePost
        };
        emitEvent('New Notification', cancelledPost.collectorId, orderComplete);
        collector.notifications.push(orderComplete);
        await UserService.addToNotifications(collector._id, orderComplete);

        const statusChanged = { by: byWho, pendingPostId: oldPending._id, sourcePostId: oldPending.sourcePost, collectorId: collector._id, publisherId: publisher._id };
        emitEvent("Pending Status Changed", publisher._id, statusChanged);
        emitEvent("Pending Status Changed", collector._id, statusChanged);
        await UserService.addToNotifications(publisher._id, statusChanged);
        await UserService.addToNotifications(collector._id, statusChanged);

        return res.status(200).json({ cancelledPost: cancelledPost, updatedPost: updatedPost, message: "Succesfully Pending Post Cancelled" });
    } catch (e) {
        console.log('Pending controller error from cancelPending: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPendingsByPost = async (req, res, next) => {
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const pendings = await PendingService.getPendingsByPost(req.params.id, page, limit);
        return res.status(200).json({ pendings: pendings, message: "Succesfully retrieved pendings" });
    } catch (e) {
        console.log('Pending controller error from cancelPending: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const decide = async (req, res, next) => {
    try {
        //#TODO SHALL I ADD ANOTHER TIMER OR IS THE MAIN TIMER GOOD ENOUGH?
        const { emitEvent } = require(".././../index");
        const pendingPost = await PendingService.getPendingById(req.query.Id);
        const before = pendingPost.status.finalStatus;
        if (publisherStatement == Status.PENDING && collectorStatement == Status.PENDING) {
            const newNotification = {
                text: pendingPost.headline,
                title: "Your order is expired",
                postId: pendingPost.sourcePost
            };
            const pendingExpired = { pendingPostId: pendingPost._id, sourcePostId: pendingPost.sourcePost, collectorId: pendingPost.collectorId, publisherId: pendingPost.publisherId };
            emitEvent('New Notification', pendingPost.collectorId, newNotification);
            emitEvent('Pending Expired', pendingPost.collectorId, pendingExpired);
            emitEvent('Pending Expired', pendingPost.publisherId, pendingExpired);
            await UserService.addToNotifications(pendingPost.collectorId, [newNotification, pendingExpired]);
            await UserService.addToNotifications(pendingPost.publisherId, pendingExpired);
        }
        await PendingService.decide(req.query.Id);
        const after = await PendingService.getPendingById(req.query.Id).then(pending => pending.status.finalStatus);
        if (String(before) != String(after)) {
            const statusChanged = { by: "system", pendingPostId: pendingPost._id, sourcePostId: pendingPost.sourcePost, collectorId: pendingPost.collectorId, publisherId: pendingPost.publisherId };
            emitEvent("Pending Status Changed", pendingPost.publisherId, statusChanged);
            emitEvent("Pending Status Changed", pendingPost.collectorId, statusChanged);
            await UserService.addToNotifications(pendingPost.publisherId, statusChanged);
            await UserService.addToNotifications(pendingPost.collectorId, statusChanged);
        }
        return res.status(200).json({ pending: pendingPost, message: "Succesfully decided PendingPost status" });
    } catch (e) {
        console.log('Pending controller error from cancelPending: ' + e.message);
        return res.status(400).json({ message: e.message });
    }
};

module.exports = {
    getPendings,
    getGroupedPendings,
    getPendingById,
    getPendingsByPublisher,
    getPendingsByCategory,
    getPendingsByTag,
    getPendingsByCollector,
    getAllFinishedPosts,
    getAllPendingPosts,
    getAllCancelledPosts,
    getPendingsByPost,
    addPending,
    decide,
    finishPending,
    cancelPending,
    deletePending,
    updatePending,
    setCollectorStatement
}