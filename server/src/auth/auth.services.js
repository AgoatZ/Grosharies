const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('../user/user.repository');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');

const getUserByEmail = async (userEmail) => {
    try {
        const user = await Repository.getUserByEmail(userEmail);
        return user;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving User');
    }
};

const addUser = async (userDetails) => {
    try {
        const user = await Repository.addUser(userDetails);
        return user;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Adding User');
    }
};

module.exports = {
    getUserByEmail,
    addUser
};