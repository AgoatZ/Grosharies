var PostService = require('./post.services');  

getposts = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    
    var page = req.params.page ? req.params.page : 1;
    var limit = req.params.limit ? req.params.limit : 10;
    try {
        var posts = await PostService.getposts({}, page, limit)
        return res.status(200).json({ status: 200, data: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

addPost = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        var post = await PostService.addPost(req.body);
        return res.status(200).json({ status: 200, data: post, message: "Succesfully Posts Added" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

deletePost = async function (req, res, next) {
    try {
        var post = await PostService.deletePost(req.params.id);
        return res.status(200).json({ status: 200, data: post, message: "Succesfully Posts Deleted" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

updatePost = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        var post = await PostService.updatePost(req.params.id, req.body);
        return res.status(200).json({ status: 200, data: post, message: "Succesfully Post Updated" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

module.exports = {
    getposts,
    addPost,
    deletePost,
    updatePost
}