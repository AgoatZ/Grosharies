const express = require('express');
const { status } = require('express/lib/response');
const Post = require('./post.model');
const router = express.Router();
const reply = require('../enums/post-reply');

const getPosts = async (query) => {
    try {
        const posts = await Post.find(query);
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Posts: ' + e.message);
    }
};

const getRelevantPosts = async () => {
    try {
        const posts = await Post.find({}).where('pickUpDates.from').
        lt(Date.now()).
        where('pickUpDates.until').
        gt(Date.now());
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Posts: ' + e.message);
    }
};

const getPostById = async (postId) => {
    try {
        const post = await Post.findById(postId);
        return post;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

const getPostsByUser = async (userId) => {
    try {
        const posts = await Post.find({ 'userId': userId });
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

const getPostsByCategory = async (categoryId) => {
    try {
        const posts = await Post.find({ 'content': { 'category': categoryId } });
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

const getPostsByTag = async (tagId) => {
    try {
        const posts = await Post.find({ 'tags': tagId });
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

const getPostsByCollector = async (userId) => {
    try {
        const posts = await Post.find({ 'repliers': { 'user': userId, 'reply': reply.PARTIALLY_TOOK || reply.TOOK } });
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

const getPostsByGroceries = async (groceries) => {
    try {
        const posts = await Post.find({}).where('content.name').in(groceries);
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};


const addPost = async (postDetails) => {
    try {
        const post = new Post(postDetails);
        return await post.save();
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Adding Post: ' + e.message);
    }
};

const deletePost = async (postId) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        return deletedPost;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Deleting Post: ' + e.message);
    }
};

const updatePost = async (postId, postDetails) => {
    try {
        const oldPost = await Post.findByIdAndUpdate(postId, postDetails);
        return oldPost;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Updating Post: ' + e.message);
    }
};

const updateContent = async (postId, content) => {
    try {
        const oldPost = await Post.findByIdAndUpdate(postId, { content: content });
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
    getPostsByGroceries,
    getRelevantPosts,
    addPost,
    deletePost,
    updatePost,
    updateContent
}
