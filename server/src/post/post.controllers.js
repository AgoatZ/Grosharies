const PostService = require('./post.services');  

getPosts = async function (req, res, next) {
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

getPostById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const post = await PostService.getPostById(req.params.id);
        return res.status(200).json({ post: post, message: "Succesfully Post Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getPostsByUser = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const posts = await PostService.getPostsByUser(req.params.id);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getPostsByCategory = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const posts = await PostService.getPostsByCategory(req.params.id);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getPostsByTag = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const posts = await PostService.getPostsByTag(req.params.id);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getPostsByCollector = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const posts = await PostService.getPostsByCollector(req.params.id);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

addPost = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const post = await PostService.addPost(req.body);
        return res.status(200).json({ post: post, message: "Succesfully Posts Added" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

pendPost = async function (req, res, next) {
    try {
        console.log("controller groceries: ", req.body.groceries);
        const { updatedPost, pendingPost } = await PostService.pendPost(req.body.postId, req.body.collectorId, req.body.groceries);
        console.log("FINISHED PENDING WITH UPDATED POST: ",updatedPost);
        console.log("FINISHED PENDING FROM PENDING POST: ",pendingPost);
        return res.status(200).json({ post: updatedPost, pending: pendingPost, message: "Succesfully Post updated and a new PendingPost added" });
    } catch (e) {
        console.log('controller error from pendPost: ' + e.message);

        return res.status(400).json({message: e.message});
    }
}

deletePost = async function (req, res, next) {
    try {
        const post = await PostService.deletePost(req.params.id);
        return res.status(200).json({ post: post, message: "Succesfully Posts Deleted" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
}

updatePost = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const oldPost = await PostService.updatePost(req.params.id, req.body);
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
    addPost,
    pendPost,
    deletePost,
    updatePost
}