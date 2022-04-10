const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./post.repository');
const GroceryRepository = require('../grocery/grocery.repository');
const UserRepository = require('../user/user.repository');
const router = express.Router();
const timeToWait = 3000000;

getPosts = async function (query, page, limit) {
    try {
        const posts = await Repository.getPosts(query);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

getPostById = async function (postId) {
    try {
        const post = await Repository.getPostById(postId);
        return post;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

getPostsByUser = async function (userId) {
    try {
        const posts = await Repository.getPostsByUser(userId);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

getPostsByCategory = async function (categoryId) {
    try {
        const posts = await Repository.getPostsByCategory(categoryId);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

getPostsByTag = async function (tagId) {
    try {
        const posts = await Repository.getPostsByTag(tagId);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

addPost = async function (postDetails) {
    try {
        const post = await Repository.addPost(postDetails);
        console.log('service: ' + post);

        return post;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

deletePost = async function (postId) {
    try {
        const deletedPost = await Repository.deletePost(postId);
        return deletedPost;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

updatePost = async function (postId, postDetails, userId) {
    try {
        //TODO ORDER AND FINISH
        let amountTaken = 0;
        const newPost = postDetails;
        const oldPost = await Repository.updatePost(postId, postDetails);
        oldPost.content.forEach(grocery => {
            newPost.content.forEach(newGrocery => {
                if(newGrocery.name.equals(grocery.name)) {
                    amountTaken = grocery.amount - newGrocery.amount;
                }
            });
            let toUpdate = GroceryRepository.getGroceryByName(grocery.name);
            toUpdate.amount += amountTaken;
            GroceryRepository.updateGrocery(toUpdate.id, toUpdate);
            let user = UserRepository.getUserById(userId);
            let collectedHistory = user.collectedHistory;
            let userGrocery = grocery;
            userGrocery.amount = amountTaken;
            let historyToAdd = {
                "grocery": userGrocery,
                "post": newPost
            };
            collectedHistory = collectedHistory.concat(historyToAdd);
            user.collectedHistory = collectedHistory;
            UserRepository.updateUser(userId, user);
        });
        return oldPost;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

interrestedUserReminder = async (userId, postId) => {
    const user = UserRepository.getUserById(userId);
    const remind = phone => console.log("UUSER REMINDER!!!");

    setTimeout(remind(user.phone), timeToWait);
};

module.exports = {
    getPosts,
    getPostById,
    getPostsByUser,
    getPostsByCategory,
    getPostsByTag,
    addPost,
    deletePost,
    updatePost
}
