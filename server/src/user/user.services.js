const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./user.repository');
const PostRepository = require('../post/post.repository');
const PendingRepository = require('../pending/pending.repository');
const router = express.Router();

getUsers = async function (query, page, limit) {
    try {
        const users = await Repository.getUsers(query);
        return users;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Paginating Users');
    }
};

getUserById = async function (userId) {
    try {
        console.log("User Service userId:", userId);
        const user = await Repository.getUserById(userId)
        return user;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving user');
    }
};

getUserByEmail = async function (userEmail) {
    try {
        const user = await Repository.getUserByEmail(userEmail)
        return user;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving user');
    }
};

addUser = async function (userDetails) {
    try {
        const user = await Repository.addUser(userDetails);
        return user;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Adding User');
    }
};

const addGoogleUser = async (user) => {
    try {
    const googleUser = await Repository.addGoogleUser(user)
    return googleUser;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e.message);
    }
};

deleteUser = async function (userId) {
    try {
        const deletedUser = await Repository.deleteUser(userId);
        return deletedUser;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Deleting User');
    }
};

updateUser = async function (userId, userDetails) {
    try {
        const oldUser = await Repository.updateUser(userId, userDetails);
        return oldUser;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Updating User');
    }
};

addToHistory = async function (userId, pendingPostId) {
    try {
        let oldUser = await Repository.getUserById(userId);
        let history = oldUser.collectedHistory;
        history = history.concat(pendingPostId);
        oldUser = await Repository.addToHistory(userId, history);
        return oldUser;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Updating User');
    }
};

getPickupHistory = async function (userId) {
    try {
        const pendingPosts = await PendingRepository.getPendingsByCollector(userId);
        return pendingPosts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving user');
    }
};

module.exports = {
    getUsers,
    getUserById,
    getUserByEmail,
    addUser,
    addGoogleUser,
    deleteUser,
    updateUser,
    addToHistory,
    getPickupHistory
};
