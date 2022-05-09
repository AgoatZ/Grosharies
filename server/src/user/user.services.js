const express = require('express');
const { status } = require('express/lib/response');
const UserRepository = require('./user.repository');
const PostRepository = require('../post/post.repository');
const PendingRepository = require('../pending/pending.repository');
const AuthService = require('../auth/auth.services');
const fs = require('fs');
const router = express.Router();

const getUsers = async function (query, page, limit) {
    try {
        const users = await UserRepository.getUsers(query);
        return users;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Paginating Users');
    }
};

const getUserById = async function (userId) {
    try {
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
        history = history.concat(pendingPostId);
        oldUser = await UserRepository.addToHistory(userId, history);
        return oldUser;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Updating User');
    }
};

const getPickupHistory = async function (userId) {
    try {
        const pendingPosts = await PendingRepository.getPendingsByCollector(userId);
        return pendingPosts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving user');
    }
};

// const updateImage = async (req, res) => {
//   try {
//     const r = "userimgtmp"+Date.now() + Math.round(Math.random() * 1E9);
//     const newFile = fs.createWriteStream(r.toString() + '.txt');
//     const chData = [];
//     req.pipe(newFile, (error) => {
//       throw Error(error);
//     });
    
//     req.on('data', function (chunk, error) {
//       chData.push(chunk);
//     });

//     req.on('end', async (error) => {
//       const enc = Buffer.from(chData).toString("base64");
//       fs.rm(newFile.path, async (error) => {
//         if (error) {
//           throw Error(error);
//         } else {
//           let user = await UserRepository.updateUser(req.params.id, { image: enc });
//           user = await UserRepository.getUserById(user._id);
//           return res.status(200).json({ user: user, message: 'Successfully uploaded image' });
//         }
//       });
//     });
//   } catch (err) {
//     throw Error(err);
//   }
// };

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
