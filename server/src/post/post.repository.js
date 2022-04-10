const express = require('express');
const { status } = require('express/lib/response');
const Post = require('./post.model');
const router = express.Router();
const reply = require('../enums/postReply');

getPosts = async (query) => {
    try {
        const posts = await Post.find(query);
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Posts: ' + e.message);
    }
};

getPostById = async function (postId) {
    try {
        const post = await Post.findById(postId);
        return post;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getPostsByUser = async function (userId) {
    try {
        const posts = await Post.find({ 'userId': userId });
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getPostsByCategory = async function (categoryId) {
    try {
        const posts = await Post.find({ 'content': { 'category': categoryId }});
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getPostsByTag = async function (tagId) {
    try {
        const posts = await Post.find({ 'tags': tagId });
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getPostsByCollector = async function (userId) {
    try {
        const posts = await Post.find({ 'repliers': { 'user': userId, 'reply':  reply.PARTIALLY_TOOK || reply.TOOK } });
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};


addPost = async function (postDetails) {
    try {
        const post = new Post(postDetails);
        return await post.save();
    } catch (e) {
        console.log('repository error: ' + e.message);
        
        throw Error('Error while Adding Post: ' + e.message);
    }
};

deletePost = async function (postId) {
    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        return deletedPost;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Deleting Post: ' + e.message);
    }
};

updatePost = async function (postId, postDetails) {
    try {
        const oldPost = await Post.findByIdAndUpdate(postId, postDetails);
        return oldPost;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Updating Post: ' + e.message);
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
    deletePost,
    updatePost
}
