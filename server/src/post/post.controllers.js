const PostService = require('./post.services');
const UserService = require('../user/user.services');

const getPosts = async (req, res, next) => {
    // Validate request parameters, queries using express-validator
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 30;
    try {
        const posts = await PostService.getPosts({}, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const searchPosts = async (req, res, next) => {
    // Validate request parameters, queries using express-validator
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 30;
    try {
        const posts = await PostService.searchPosts(req.params.search, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPostById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const post = await PostService.getPostById(req.params.id);
        return res.status(200).json({ post: post, message: "Succesfully Post Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPostsByUser = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 30;
    try {
        const posts = await PostService.getPostsByUser(req.params.id, req.user, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPublisherOpenPosts = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 30;
    try {
        const posts = await PostService.getPublisherOpenPosts(req.params.id, req.user, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPostsByCategory = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 30;
    try {
        const posts = await PostService.getPostsByCategory(req.params.id, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPostsByTag = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 30;
    try {
        const posts = await PostService.getPostsByTag(req.params.id, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPostsByCollector = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 30;
    try {
        const posts = await PostService.getPostsByCollector(req.params.id, req.user, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPostsByGroceries = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 30;
    try {
        const posts = await PostService.getPostsByGroceries(req.body.groceries, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getSuggestedPosts = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 30;
    try {
        const posts = await PostService.getSuggestedPosts(req.params.userid, req.user, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Suggested Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getNearbyPosts = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 30;
    try {
        const posts = await PostService.getNearbyPosts(req.body.coordinates, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Nearby Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPostImages = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const images = await PostService.getPostImages(req.params.id);
        return res.status(200).json({ images: images, message: "Succesfully images Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const addPost = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const post = await PostService.addPost(req.body, req.user);
        return res.status(200).json({ post: post, message: "Succesfully Posts Added" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const pendPost = async function (req, res, next) {
    try {
        const { emitEvent, broadcastEvent } = require(".././../index");
        const { updatedPost, pendingPost } = await PostService.pendPost(req.body.postId, req.user._id, req.body.groceries);
        const collector = await UserService.getUserById(pendingPost.collectorId);
        const newNotification = {
            text: pendingPost.headline,
            title: "A new order by " + collector.firstName + " " + collector.lastName,
            postId: pendingPost.sourcePost
        };
        const collectorNotification = {
            text: pendingPost.headline,
            title: "Your order was created",
            postId: pendingPost.sourcePost
        };
        const publisherNote = {
            pendingPostId: pendingPost._id,
            sourcePostId: updatedPost._id,
            collectorId: pendingPost.collectorId,
            publisherId: updatedPost.userId
        };
        emitEvent('Pending Created', updatedPost.userId, publisherNote);
        //TODO: add to collector also
        emitEvent("New Notification", updatedPost.userId, newNotification);
        emitEvent("New Notification", collector._id, collectorNotification);

        await UserService.addToNotifications(updatedPost.userId, newNotification);
        await UserService.addToNotifications(collector._id, collectorNotification);
        return res.status(200).json({ post: updatedPost, pending: pendingPost, message: "Succesfully Post updated and a new PendingPost added" });
    } catch (e) {
        console.log('controller error from pendPost: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
}

const deletePost = async function (req, res, next) {
    try {
        const { emitEvent, broadcastEvent } = require(".././../index");
        const oldPost = await PostService.deletePost(req.params.id);
        const newNotification = {
            text: oldPost.headline,
            title: "A post of your order was deleted",                  //TOFIX: emitted and added too many times for one replier
            postId: oldPost._id
        };
        broadcastEvent('Post Deleted', { postId: oldPost._id });
        for (i in oldPost.repliers) {
            emitEvent('New Notification', oldPost.repliers[i].user, newNotification);
            await UserService.addToNotifications(oldPost.repliers[i].user, newNotification);
        }
        return res.status(200).json({ post: oldPost, message: "Succesfully Posts Deleted" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
}

const updatePost = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const { emitEvent, broadcastEvent } = require(".././../index");
        const oldPost = await PostService.updatePost(req.params.id, req.body);
        const newNotification = {
            text: oldPost.headline,
            title: "A post of your order was edited",
            postId: oldPost._id
        };
        const publisherNote = { postId: oldPost._id };
        broadcastEvent('Post Edited', publisherNote);
        for (i in oldPost.repliers) {
            emitEvent('New Notification', oldPost.repliers[i].user, newNotification);
            await UserService.addToNotifications(oldPost.repliers[i].user, newNotification);
        }
        return res.status(200).json({ oldPost: oldPost, message: "Succesfully Post Updated" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

module.exports = {
    getPosts,
    getPostById,
    getPostsByUser,
    getPostsByCategory,
    getPostsByTag,
    getPostsByCollector,
    getPostsByGroceries,
    getSuggestedPosts,
    getNearbyPosts,
    getPublisherOpenPosts,
    addPost,
    pendPost,
    deletePost,
    updatePost,
    searchPosts,
    getPostImages
};