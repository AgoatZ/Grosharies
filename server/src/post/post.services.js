const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./post.repository');
const GroceryRepository = require('../grocery/grocery.repository');
const PendingRepository = require('../pending/pending.repository');
const UserRepository = require('../user/user.repository');
const Grocery = require('../grocery/grocery.model');
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

getPostsByCollector = async function (userId) {
    try {
        const posts = await Repository.getPostsByCollector(userId);
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
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

updatePost = async function (postId, postDetails) {
    try {
        const oldPost = await Repository.updatePost(postId, postDetails);
        return oldPost;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

pendPost = async function (postId, collectorId, groceries) {
    try {
        const post = await Repository.getPostById(postId);
        const updatedContent = [];

        console.log("service groceries: ", groceries);
        console.log("service post groceries: ", post.content);

        post.content.forEach(grocery => {
            console.log("grocery from post: ", grocery);
            var isThere = false;
            groceries.forEach(newGrocery => {
                console.log("grocery from array: ", newGrocery);
                if(newGrocery.name === grocery.name) {
                    //reduce amount and creat json for updating
                    isThere = true;
                    amount = grocery.amount - newGrocery.amount;
                    if (amount < 0) {
                        throw Error("Requested amount is higher than available");
                    }
                    updatedContent.push({
                        "name": grocery.name,
                        "amount": amount,
                        "scale": grocery.scale,
                        "packing": grocery.packing,
                        "category": grocery.category
                    });
                }
            });
            if (!isThere) {
                updatedContent.push(grocery);
            }
        });
        console.log(updatedContent);
        await Repository.updateContent(postId, updatedContent);

        const oneHour = 60*60*1000;
        const pendingPost = await PendingRepository.addPending({
            "headline": post.headline,
            "address": post.address,
            "content": groceries,
            "sourcePost": post._id,
            "publisherId": post.userId,
            "collectorId": collectorId,
            "pendingTime": { 
                "from": Date.now(),
                "until": Date.now() + oneHour
              }
        });

        const updatedPost = await Repository.getPostById(postId);

        return { updatedPost, pendingPost };
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};
/*
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
        }
        return oldPost;
*/

interrestedUserReminder = async (userId, postId) => {
    const user = UserRepository.getUserById(userId);
    const remind = async (phone) => {
        console.log("TAKEN???");
        setTimeout(decide, timeToWait);
    }

    setTimeout(remind(user.phone), timeToWait);
};

module.exports = {
    getPosts,
    getPostById,
    getPostsByUser,
    getPostsByCategory,
    getPostsByTag,
    getPostsByCollector,
    addPost,
    pendPost,
    deletePost,
    updatePost
}
