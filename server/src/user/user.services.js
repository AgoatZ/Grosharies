const express = require('express');
const { status } = require('express/lib/response');
const User = require('./user.model');
const router = express.Router();

getUsers = async function (query, page, limit) {
    try {
        var users = await User.find(query)
        return users;
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
};

addUser = async function (userDetails) {
    try {
        var user = new User(userDetails);
        return user.save();
    } catch (e) {
        // Log Errors
        throw Error('Error while Adding User')
    }
};

deleteUser = async function (userId) {
    try {
        var deletedUser = User.findByIdAndDelete(userId);
        return deletedUser;
    } catch (e) {
        // Log Errors
        throw Error('Error while Deleting User');
    }
};

updateUser = async function (userId, userDetails) {
    try {
        var oldUser = User.findByIdAndUpdate(userId, userDetails);
        return oldUser;
    } catch (e) {
        // Log Errors
        throw Error('Error while Updating User')
    }
};

module.exports = {
    getUsers,
    addUser,
    deleteUser,
    updateUser
}
