const PendingService = require('./pending.services');
const UserService = require('../user/user.services');

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
        emitEvent('New Pending Post', pendingPost.publisherId, {
            sourcePostId: pendingPost.sourcePost,
            pendingPostId: pendingPost._id
        });
        emitEvent('New Notification', pendingPost.publisherId, {
            text: pendingPost.headline,
            title: "A new order by " + collector.firstName + " " + collector.lastName,
            postId: pendingPost.sourcePost
        });
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
        const { emitEvent } = require(".././../index");

        const oldPost = await PendingService.updatePending(req.params.id, req.body);
        const collector = await UserService.getUserById(oldPost.collectorId);
        emitEvent('New Notification', oldPost.publisherId, {
            text: oldPost.headline,
            title: "An order was edited by " + collector.firstName + " " + collector.lastName,
            postId: oldPost.sourcePost });
        return res.status(200).json({ oldPost: oldPost, message: "Succesfully Post Updated" });
    } catch (e) {
        console.log('Pending controller error from updatePending: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const setCollectorStatement = async function (req, res, next) {
    try {
        const oldPending = await PendingService.setCollectorStatement(req.params.id, req.user);
        return res.status(200).json({ oldPending: oldPending, message: "Succesfully Post Updated" });
    } catch (e) {
        console.log('Pending service error from setCollectorStatement: ', e.message);

        throw Error('Error while changing statement Posts');
    }
};

const finishPending = async function (req, res, next) {
    try {
        console.log('Enterred finishPending Controller')
        const { emitEvent } = require(".././../index");

        const {finishedPending, trafficGroceries} = await PendingService.finishPending(req.params.id, req.user);
        const collector = await UserService.getUserById(finishedPending.collectorId);

        if (req.user && req.user._id == finishedPending.collectorId) {
            emitEvent('New Notification', finishedPending.publisherId, {
                text: finishedPending.headline,
                title: "An order was completed by " + collector.firstName + " " + collector.lastName,
                postId: finishedPending.sourcePost
            });
        } else if (req.user && req.user._id == finishedPending.publisherId) {
            emitEvent('New Notification', finishedPending.publisherId, {
                text: finishedPending.headline,
                title: "An order was completed",
                postId: finishedPending.sourcePost
            });
            emitEvent('Pending Completed', finishedPending.collectorId, {
                pendingPostId: finishedPending._id
            });
        }
        emitEvent('New Notification', finishedPending.collectorId, {
            text: finishedPending.headline,
            title: "Your order is completed",
            postId: finishedPending.sourcePost
        });

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
        const collector = await UserService.getUserById(finishedPending.collectorId);

        if (req.user && req.user._id == cancelledPost.collectorId) {
            emitEvent('New Notification', cancelledPost.publisherId, {
                text: cancelledPost.headline,
                title: "An order was cancelled by " + collector.firstName + " " + collector.lastName,
                postId: cancelledPost.sourcePost
            });
        } else if (req.user && req.user._id == cancelledPost.publisherId) {
            emitEvent('New Notification', cancelledPost.publisherId, {
                text: cancelledPost.headline,
                title: "An order was cancelled",
                postId: cancelledPost.sourcePost
            });
            emitEvent('Pending Cancelled', cancelledPost.collectorId, {
                pendingPostId: cancelledPost._id
            });
        }
        emitEvent('New Notification', cancelledPost.collectorId, {
            text: cancelledPost.headline,
            title: "Your order is cancelled",
            postId: cancelledPost.sourcePost
        });
        
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
        /**Emit event 'New Notification' to room (collector id) with data: 
		{ text:"THE POST HEADLINE" 	title: "Your order is expired",	postId: "" }

	Emit event 'Pending Expired' to room (collector id) with data:				
		{ pendingPostId: "" } */
        const { emitEvent } = require(".././../index");

        await PendingService.decide(req.query.Id);
        const pendingPost = await PendingService.getPendingById(req.query.Id);

        emitEvent('New Notification', pendingPost.collectorId, {
            text:pendingPost.headline,
            title: "Your order is expired",
            postId: pendingPost.sourcePost
        });
        emitEvent('Pending Expired', pendingPost.collectorId, { pendingPostId: pendingPost._id});

        return res.status(200).json({ pendings: pendings, message: "Succesfully retrieved pendings" });
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