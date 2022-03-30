const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./user.repository');
const router = express.Router();

getUsers = async function (query, page, limit) {
    try {
        var users = await Repository.getUsers(query);
        return users;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Paginating Users')
    }
};

getUserById = async function (userId) {
    try {
        var user = await Repository.getUserById(userId)
        return user;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving user')
    }
};

addUser = async function (userDetails) {
    try {
        var user = await Repository.addUser(userDetails);
        return user;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Adding User')
    }
};

deleteUser = async function (userId) {
    try {
        var deletedUser = await Repository.deleteUser(userId);
        return deletedUser;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Deleting User');
    }
};

updateUser = async function (userId, userDetails) {
    try {
        var oldUser = await Repository.updateUser(userId, userDetails);
        return oldUser;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Updating User')
    }
};

module.exports = {
    getUsers,
    getUserById,
    addUser,
    deleteUser,
    updateUser
}
