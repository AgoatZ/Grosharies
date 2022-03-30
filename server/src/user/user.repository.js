const express = require('express');
const { status } = require('express/lib/response');
const User = require('./user.model');
const router = express.Router();

getUsers = async function (query) {
    try {
        const users = await User.find(query);
        return users;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Paginating Users');
    }
};

getUserById = async function (userId) {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving user');
    }
};

addUser = async function (userDetails) {
    try {
        const user = new User(userDetails);
        return await user.save();
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Adding User');
    }
};

deleteUser = async function (userId) {
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        return deletedUser;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Deleting User');
    }
};

updateUser = async function (userId, userDetails) {
    try {
        const oldUser = await User.findByIdAndUpdate(userId, userDetails);
        return oldUser;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Updating User');
    }
};

module.exports = {
    getUsers,
    getUserById,
    addUser,
    deleteUser,
    updateUser
}
