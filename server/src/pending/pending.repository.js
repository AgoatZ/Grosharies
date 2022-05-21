const express = require('express');
const Pending = require('./pending.model');
const Status = require('../enums/pending-status');

const getPendings = async (query) => {
    try {
        const pendingPosts = await Pending.find(query);
        return pendingPosts;
    } catch (e) {
        console.log('Pending repository error from getPendings: ', e.message);

        throw Error('Error while Retrieving Posts');
    }
};

const getPendingById = async function (postId) {
    try {
        const pendingPost = await Pending.findById(postId);
        return pendingPost;
    } catch (e) {
        console.log('Pending repository error from getPendingById: ', e.message);

        throw Error('Error while Retrieving Post');
    }
};

const getPendingsByPublisher = async function (userId) {
    try {
        console.log("bypublisher userId:", userId);
        const cancelledPendings = await Pending.find({ 'publisherId': userId, 'status.finalStatus': Status.CANCELLED });
        const finishedPendings = await Pending.find({ 'publisherId': userId, 'status.finalStatus': Status.COLLECTED });
        const pendingPosts = await Pending.find({ 'publisherId': userId, 'status.finalStatus': Status.PENDING });
        return { pendingPosts, finishedPendings, cancelledPendings };
    } catch (e) {
        console.log('Pending repository error from getPendingsByPublisher: ', e.message);

        throw Error('Error while Retrieving Post');
    }
};

const getPendingsByCollector = async function (userId) {
    try {
        console.log("bycollector userId:", userId)
        const cancelledPendings = await Pending.find({ 'collectorId': userId, 'status.finalStatus': Status.CANCELLED });
        const finishedPendings = await Pending.find({ 'collectorId': userId, 'status.finalStatus': Status.COLLECTED });
        const pendingPosts = await Pending.find({ 'collectorId': userId, 'status.finalStatus': Status.PENDING });
        return { pendingPosts, finishedPendings, cancelledPendings };
    } catch (e) {
        console.log('Pending repository error from getPendingsByCollector: ', e.message);

        throw Error('Error while Retrieving Posts');
    }
};

const getPendingsByCategory = async function (categoryId) {
    try {
        const pendingPosts = await Pending.find({ 'content': { 'category': categoryId }});
        return pendingPosts;
    } catch (e) {
        console.log('Pending repository error from getPendingsByCategory: ', e.message);

        throw Error('Error while Retrieving Posts');
    }
};

const getPendingsByTag = async function (tagId) {
    try {
        const pendingPosts = await Pending.find({ 'tags': tagId });
        return pendingPosts;
    } catch (e) {
        console.log('Pending repository error from getPendingsByTag: ', e.message);

        throw Error('Error while Retrieving Posts');
    }
};

const getPendingsByPost = async function (postId) {
    try {
        const pendingPosts = await Pending.find({ 'sourcePost': postId });
        return pendingPosts;
    } catch (e) {
        console.log('Pending repository error from getPendingsByPost: ', e.message);

        throw Error('Error while Retrieving Posts');
    }
};

const getAllPendingPosts = async function () {
    try {
        const pendingPosts = await Pending.find({ 'status.finalStatus': Status.PENDING });
        return pendingPosts;
    } catch (e) {
        console.log('Pending repository error from getAllPendingPosts: ', e.message);

        throw Error('Error while Retrieving Post');
    }
};

const getAllFinishedPosts = async function () {
    try {
        const finishedPosts = await Pending.find({ 'status.finalStatus': Status.COLLECTED });
        return finishedPosts;
    } catch (e) {
        console.log('Pending repository error from getAllFinishedPosts: ', e.message);

        throw Error('Error while Retrieving Post');
    }
};

const getAllCancelledPosts = async function () {
    try {
        const cancelledPosts = await Pending.find({ 'status.finalStatus': Status.CANCELLED });
        return cancelledPosts;
    } catch (e) {
        console.log('Pending repository error from getAllCancellededPosts: ', e.message);

        throw Error('Error while Retrieving Post');
    }
};

const addPending = async function (postDetails) {
    try {
        const pendingPost = new Pending(postDetails);
        return await pendingPost.save();
    } catch (e) {
        console.log('Pending repository error from addPending: ', e.message);
        
        throw Error('Error while Adding Post');
    }
};

const deletePending = async function (postId) {
    try {
        const deletedPendingPost = await Pending.findByIdAndDelete(postId);
        return deletedPendingPost;
    } catch (e) {
        console.log('Pending repository error from deletePending: ', e.message);

        throw Error('Error while Deleting Post');
    }
};

const updatePending = async function (postId, postDetails) {
    try {
        //console.log(postDetails);
        const oldPendingPost = await Pending.findByIdAndUpdate(postId, postDetails);
        return oldPendingPost;
    } catch (e) {
        console.log('Pending repository error from updatePending: ', e.message);

        throw Error('Error while Updating Post');
    }
};

module.exports = {
    getPendings,
    getPendingById,
    getPendingsByPublisher,
    getPendingsByCategory,
    getPendingsByTag,
    getPendingsByCollector,
    getPendingsByPost,
    getAllFinishedPosts,
    getAllPendingPosts,
    getAllCancelledPosts,
    addPending,
    deletePending,
    updatePending,
}
