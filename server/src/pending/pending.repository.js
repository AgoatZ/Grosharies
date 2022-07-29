const express = require('express');
const Pending = require('./pending.model');
const Status = require('../enums/pending-status');

const getPendings = async (query, options) => {
    try {
        const pendingPosts = await Pending.paginate(query, options);
        return pendingPosts.docs;
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

const getPendingsByPublisher = async function (userId, options) {
    try {
        let cancelledPendings = await Pending.paginate({ 'publisherId': userId, 'status.finalStatus': Status.CANCELLED }, options);
        cancelledPendings = cancelledPendings.docs;
        let finishedPendings = await Pending.paginate({ 'publisherId': userId, 'status.finalStatus': Status.COLLECTED }, options);
        finishedPendings = finishedPendings.docs;
        let pendingPosts = await Pending.paginate({ 'publisherId': userId, 'status.finalStatus': Status.PENDING }, options);
        pendingPosts = pendingPosts.docs;
        return { pendingPosts, finishedPendings, cancelledPendings };
    } catch (e) {
        console.log('Pending repository error from getPendingsByPublisher: ', e.message);

        throw Error('Error while Retrieving Post');
    }
};

const getPendingsByCollector = async function (userId, options) {
    try {
        let cancelledPendings = await Pending.paginate({ 'collectorId': userId, 'status.finalStatus': Status.CANCELLED }, options);
        cancelledPendings = cancelledPendings.docs;
        let finishedPendings = await Pending.paginate({ 'collectorId': userId, 'status.finalStatus': Status.COLLECTED }, options);
        finishedPendings = finishedPendings.docs;
        let pendingPosts = await Pending.paginate({ 'collectorId': userId, 'status.finalStatus': Status.PENDING }, options);
        pendingPosts = pendingPosts.docs;
        return { pendingPosts, finishedPendings, cancelledPendings };
    } catch (e) {
        console.log('Pending repository error from getPendingsByCollector: ', e.message);

        throw Error('Error while Retrieving Posts');
    }
};

const getPendingsByCategory = async function (categoryId, options) {
    try {
        const pendingPosts = await Pending.paginate({ 'content': { 'category': categoryId }}, options);
        return pendingPosts.docs;
    } catch (e) {
        console.log('Pending repository error from getPendingsByCategory: ', e.message);

        throw Error('Error while Retrieving Posts');
    }
};

const getPendingsByTag = async function (tagId, options) {
    try {
        const pendingPosts = await Pending.paginate({ 'tags': tagId }, options);
        return pendingPosts.docs;
    } catch (e) {
        console.log('Pending repository error from getPendingsByTag: ', e.message);

        throw Error('Error while Retrieving Posts');
    }
};

const getPendingsByPost = async function (postId, options) {
    try {
        const pendingPosts = await Pending.paginate({ 'sourcePost': postId }, options);
        return pendingPosts.docs;
    } catch (e) {
        console.log('Pending repository error from getPendingsByPost: ', e.message);

        throw Error('Error while Retrieving Posts');
    }
};

const getAllPendingPosts = async function (options) {
    try {
        const pendingPosts = await Pending.paginate({ 'status.finalStatus': Status.PENDING }, options);
        return pendingPosts.docs;
    } catch (e) {
        console.log('Pending repository error from getAllPendingPosts: ', e.message);

        throw Error('Error while Retrieving Post');
    }
};

const getAllFinishedPosts = async function (options) {
    try {
        const finishedPosts = await Pending.paginate({ 'status.finalStatus': Status.COLLECTED }, options);
        return finishedPosts.docs;
    } catch (e) {
        console.log('Pending repository error from getAllFinishedPosts: ', e.message);

        throw Error('Error while Retrieving Post');
    }
};

const getAllCancelledPosts = async function (options) {
    try {
        const cancelledPosts = await Pending.paginate({ 'status.finalStatus': Status.CANCELLED }, options);
        return cancelledPosts.docs;
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
