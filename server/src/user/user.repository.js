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

getUserByEmail = async function (userEmail) {
    try {
        const user = await User.findOne({ 'emailAddress': userEmail});
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

const addGoogleUser = (User) => async ({ id, email, firstName, lastName, profilePhoto }) => {
    const user = new User({
      "_id": id,
      "emailAddress": email,
      "firstName": firstName,
      "lastName": lastName,
      "profileImage": profilePhoto,
      "source": "google"
    })
    return await user.save()
  }

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

addToHistory = async function (userId, history) {
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
    addGoogleUser,
    addToHistory,
    deleteUser,
    updateUser
}
