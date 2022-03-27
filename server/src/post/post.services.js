const express = require('express');
const { status } = require('express/lib/response');
const Post = require('./post.model');
const router = express.Router();

getPosts = async function (query, page, limit) {
    try {
        var posts = await Post.find(query)
        return posts;
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Posts')
    }
};

addPost = async function (postDetails) {
    try {
        var post = new Post(postDetails);
        return post.save();
    } catch (e) {
        // Log Errors
        throw Error('Error while Adding Post')
    }
};

deletePost = async function (postId) {
    try {
        var deletedPost = Post.findByIdAndDelete(postId);
        return deletedPost;
    } catch (e) {
        // Log Errors
        throw Error('Error while Deleting Post');
    }
};

updatePost = async function (postId, postDetails) {
    try {
        var oldPost = Post.findByIdAndUpdate(postId, postDetails);
        return oldPost;
    } catch (e) {
        // Log Errors
        throw Error('Error while Updating Post')
    }
};

module.exports = {
    getPosts,
    addPost,
    deletePost,
    updatePost
}
