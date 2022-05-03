const express = require('express');
const { status } = require('express/lib/response');
const UserRepository = require('./user.repository');
const PostRepository = require('../post/post.repository');
const PendingRepository = require('../pending/pending.repository');
const router = express.Router();

getUsers = async function (query, page, limit) {
    try {
        const users = await UserRepository.getUsers(query);
        return users;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Paginating Users');
    }
};

getUserById = async function (userId) {
    try {
        const user = await UserRepository.getUserById(userId)
        return user;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving user');
    }
};

getUserByEmail = async function (userEmail) {
    try {
        const user = await UserRepository.getUserByEmail(userEmail)
        return user;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving user');
    }
};

addUser = async function (userDetails) {
    try {
        const exists = await UserRepository.getUserByEmail(userDetails.emailAddress);
        if (exists) throw Error('This email address belongs to another user');
        else {
            const user = await UserRepository.addUser(userDetails);
            return user;
        }
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Adding User');
    }
};

const addGoogleUser = async (user) => {
    try {
        const exists = await UserRepository.getUserByEmail(user.emailAddress);
        if (exists) return exists;
        else {
            const googleUser = await UserRepository.addUser(user)
            return googleUser;
        }
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while adding google user');
    }
};

deleteUser = async function (userId) {
    try {
        const deletedUser = await UserRepository.deleteUser(userId);
        return deletedUser;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Deleting User');
    }
};

updateUser = async function (userId, userDetails) {
    try {
        const exists = await UserRepository.getUserByEmail(userDetails.emailAddress);
        if (exists && exists._id !== userId) throw Error('This email address belongs to another user');
        else {
            const oldUser = await UserRepository.updateUser(userId, userDetails);
            return oldUser;
        }
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Updating User');
    }
};

addToHistory = async function (userId, pendingPostId) {
    try {
        let oldUser = await UserRepository.getUserById(userId);
        let history = oldUser.collectedHistory;
        history = history.concat(pendingPostId);
        oldUser = await UserRepository.addToHistory(userId, history);
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
