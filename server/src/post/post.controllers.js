const PostService = require('./post.services');
const UserService = require('../user/user.services');

const getPosts = async (req, res, next) => {
    // Validate request parameters, queries using express-validator
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
    try {
        const posts = await PostService.getPosts({}, page, limit);
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
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
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
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
    try {
        const posts = await PostService.getPublisherOpenPosts(req.params.id, req.user, page, limit);
        //sio.emit("pend post notification", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPostsByCategory = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
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
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
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
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
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
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
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
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
    try {
        //.emit("pend post notification", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        const posts = await PostService.getSuggestedPosts(req.params.userid, req.user, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Suggested Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getNearbyPosts = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
    try {
        const posts = await PostService.getNearbyPosts(req.user, req.body.coordinates, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Nearby Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const addPost = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const post = await PostService.addPost(req.body);
        return res.status(200).json({ post: post, message: "Succesfully Posts Added" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const pendPost = async function (req, res, next) {
    try {
        const { updatedPost, pendingPost } = await PostService.pendPost(req.body.postId, req.user._id, req.body.groceries);
        return res.status(200).json({ post: updatedPost, pending: pendingPost, message: "Succesfully Post updated and a new PendingPost added" });
    } catch (e) {
        console.log('controller error from pendPost: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
}

const deletePost = async function (req, res, next) {
    try {
        const post = await PostService.deletePost(req.params.id);
        return res.status(200).json({ post: post, message: "Succesfully Posts Deleted" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
}

const updatePost = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const { emitEvent } = require(".././../index");
        const oldPost = await PostService.updatePost(req.params.id, req.body);
        const newNotification = {
            text: oldPost.headline,
            title: "A post of your order was edited",
            postId: oldPost._id
        };
        emitEvent('Post Edited', oldPost._id, {});
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
    updatePost
}