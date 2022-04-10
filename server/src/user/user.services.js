const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./user.repository');
const PostRepository = require('../post/post.repository');
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
        const user = await Repository.getUserById(userId)
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

getPickupHistory = async function (userId) {
    try {
        const posts = PostRepository.getPosts();
        const user = Repository.getUserById(userId);
        let history = [];
        user.collectedHistory.forEach(postAndGrocery => {
            posts.forEach(post => {
                if(post.id.equals(postAndGrocery.post)) {
                    history = history.concat(post);
                }
            })
        })
        return history;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving user');
    }
};

module.exports = {
    getUsers,
    getUserById,
    addUser,
    deleteUser,
    updateUser,
    getPickupHistory
};
