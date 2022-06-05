const express = require('express');
const { status } = require('express/lib/response');
const UserRepository = require('./user.repository');
const PendingRepository = require('../pending/pending.repository');
const AuthService = require('../auth/auth.services');

const getUsers = async function (query, page, limit) {
    try {
        let options;
        if (page && limit) {
            options = { page: page, limit: limit };
        } else {
            options = { pagination: false }
        }
        const users = await UserRepository.getUsers(query, options);
        return users;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Paginating Users');
    }
};

const getUserById = async function (id, currentUser) {
    try {
        let userId;
        if (id == 'current' && currentUser) {
            userId = currentUser._id;
            //console.log("Service bypublisher from user._id userId:", userId)
        } else {
            userId = id;
            //console.log("Service bypublisher from params userId:", userId)
        }
        const user = await UserRepository.getUserById(userId)
        return user;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving user');
    }
};

const getUserByEmail = async function (userEmail) {
    try {
        const user = await UserRepository.getUserByEmail(userEmail)
        return user;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving user');
    }
};

const addUser = async function (userDetails) {
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
            //const googleUser = await UserRepository.addUser(user)
            const googleUser = await AuthService.register(user);
            return googleUser;
        }
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while adding google user');
    }
};

const deleteUser = async function (userId) {
    try {
        const deletedUser = await UserRepository.deleteUser(userId);
        return deletedUser;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Deleting User');
    }
};

const updateUser = async function (userId, userDetails) {
    try {
        const exists = await UserRepository.getUserByEmail(userDetails.emailAddress);
        if (exists && exists._id !== userId) throw Error('This email address belongs to another user');
        else {
            if(userDetails.image) {
                userDetails.profileImage = userDetails.image;
                delete userDetails['image'];
            }
            const oldUser = await UserRepository.updateUser(userId, userDetails);
            return oldUser;
        }
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Updating User');
    }
};

const addToHistory = async function (userId, pendingPostId) {
    try {
        let oldUser = await UserRepository.getUserById(userId);
        let history = oldUser.collectedHistory;
        //console.log(history);
        //console.log(oldUser);
        history = history.concat(pendingPostId);
        oldUser = await UserRepository.updateUser(userId, { collectedHistory: history });
        return oldUser;
    } catch (e) {
        console.log('Service error from addToHistory: ' + e.message);

        throw Error('Error while Updating User');
    }
};

const getPickupHistory = async function (id, currentUser) {
    try {
        let userId;
        if (id == 'current' && currentUser) {
            userId = currentUser._id;
            //console.log("Service bypublisher from user._id userId:", userId)
        } else {
            userId = id;
            //console.log("Service bypublisher from params userId:", userId)
        }
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
    getPickupHistory,
};
