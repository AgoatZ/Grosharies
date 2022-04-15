const express = require('express');
const { status } = require('express/lib/response');
const Pending = require('./pending.model');
const router = express.Router();
const reply = require('../enums/postReply');
const Status = require('../enums/pendingStatus');

getPosts = async (query) => {
    try {
        const pendingPosts = await Pending.find(query);
        return pendingPosts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Posts: ' + e.message);
    }
};

getPostById = async function (postId) {
    try {
        const pendingPost = await Pending.findById(postId);
        return pendingPost;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getPostsByUser = async function (userId) {
    try {
        const pendingPosts = await Pending.find({ 'userId': userId });
        return pendingPosts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getPostsByCollector = async function (userId) {
    try {
        const pendingPosts = await Pending.find({ 'collectorId': userId });
        return pendingPosts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getPostsByCategory = async function (categoryId) {
    try {
        const pendingPosts = await Pending.find({ 'content': { 'category': categoryId }});
        return pendingPosts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getPostsByTag = async function (tagId) {
    try {
        const pendingPosts = await Pending.find({ 'tags': tagId });
        return pendingPosts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getAllPendingPosts = async function () {
    try {
        const pendingPosts = await Pending.find({ 'status': Status.PENDING });
        return pendingPosts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getAllFinishedPosts = async function () {
    try {
        const finishedPosts = await Pending.find({ 'status': Status.COLLECTED });
        return finishedPosts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getAllCancelledPosts = async function () {
    try {
        const finishedPosts = await Pending.find({ 'status': Status.CANCELLED });
        return finishedPosts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

addPending = async function (postDetails) {
    try {
        const pendingPost = new Pending(postDetails);
        return await pendingPost.save();
    } catch (e) {
        console.log('repository error: ' + e.message);
        
        throw Error('Error while Adding Post: ' + e.message);
    }
};

deletePost = async function (postId) {
    try {
        const deletedPendingPost = await Pending.findByIdAndDelete(postId);
        return deletedPendingPost;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Deleting Post: ' + e.message);
    }
};

updatePost = async function (postId, postDetails) {
    try {
        const oldPendingPost = await Pending.findByIdAndUpdate(postId, postDetails);
        return oldPendingPost;
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
    getAllFinishedPosts,
    getAllPendingPosts,
    getAllCancelledPosts,
    addPending,
    deletePost,
    updatePost
}
