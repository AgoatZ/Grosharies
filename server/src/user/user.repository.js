const express = require('express');
const { status } = require('express/lib/response');
const User = require('./user.model');

const getUsers = async function (query, options) {
    try {
        const users = await User.paginate(query, options);
        return users.docs;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Paginating Users');
    }
};

const getUserById = async function (userId) {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving user');
    }
};

const getUserByEmail = async function (userEmail) {
    try {
        const user = await User.findOne({ 'emailAddress': userEmail});
        return user;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving user');
    }
};

const addUser = async function (userDetails) {
    try {
        const user = new User(userDetails);
        return await user.save();
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Adding User');
    }
};

const deleteUser = async function (userId) {
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        return deletedUser;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Deleting User');
    }
};

const updateUser = async function (userId, userDetails) {
    try {
        const newUser = await User.findByIdAndUpdate(userId, {$set: userDetails},{new:true});
        return newUser;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Updating User');
    }
};

const addToHistory = async function (userId, history) {
    try {
        const oldUser = await User.findByIdAndUpdate(userId, {collectedHistory: history});
        return oldUser;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Updating User');
    }
};

module.exports = {
    getUsers,
    getUserById,
    getUserByEmail,
    addUser,
    addToHistory,
    deleteUser,
    updateUser,
};