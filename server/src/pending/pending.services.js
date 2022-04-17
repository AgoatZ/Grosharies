const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./pending.repository');
const GroceryRepository = require('../grocery/grocery.repository');
const UserRepository = require('../user/user.repository');
const PostRepository = require('../post/post.repository');
const router = express.Router();
const oneHour = process.env.ONE_HOUR;
const Status = require('../enums/pendingStatus');

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

getPostsByCollector = async function (userId) {
    try {
        const pendingPosts = await Repository.getPostsByCollector(userId);
        return pendingPosts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
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

addPending = async function (postDetails) {
    try {
        const pendingPost = await Repository.addPending(postDetails);
        await interrestedUserReminder(pendingPost.collectorId, pendingPost._id);

        return pendingPost;
    } catch (e) {
        console.log('service error from addPending: ' + e.message);

        throw Error(e);
    }
};

/*
addPendingFromPost = async function (postId, data) {
    try {
        let post = await PostRepository.getPostById(postId);
        delete post[_id];
        post = JSON.stringify(post).concat(data);
        post = await Repository.addPost(post);        
        console.log('service: ' + post);

        return post;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};
*/

deletePost = async function (postId) {
    try {
        const deletedPost = await Repository.deletePost(postId);
        return deletedPost;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

getAllPendingPosts = async function () {
    try {
        const pendingPosts = await Repository.getAllPendingPosts();
        return pendingPosts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getAllFinishedPosts = async function () {
    try {
        const finishedPosts = await Repository.getAllFinishedPosts();
        return finishedPosts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getAllCancelledPosts = async function () {
    try {
        const finishedPosts = await Repository.getAllCancelledPosts();
        return finishedPosts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
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

finishPending = async function (pendingPostId) {
    try {
        let pendingPost = await Repository.getPostById(pendingPostId);
        if (pendingPost.status !== Status.PENDING) {
            throw Error('Pending Post is not pending anymore!');
        }
        const trafficGroceries = [];
        const content = pendingPost.content;        
        for (grocery in content) {
            let trafficGrocery = await GroceryRepository.getGroceryByName(content[grocery].name);
            let newAmount = content[grocery].amount + trafficGrocery.amount;
            await GroceryRepository.updateAmount(trafficGrocery._id, newAmount);
            trafficGrocery = await GroceryRepository.getGroceryByName(content[grocery].name);
            trafficGroceries.push(trafficGrocery);
        }
        await Repository.updatePostStatus(pendingPostId, Status.COLLECTED);

        const finishedPost = await Repository.getPostById(pendingPostId);

        return {finishedPost, trafficGroceries};
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

const cancelPending = async function (pendingPostId) {
    console.log("ENTERRED CANCEL PENDING FIRST");
    try {
        console.log("cacncelling ID: ", pendingPostId);
        let pendingPost = await Repository.getPostById(pendingPostId);
        console.log("pendingPost at service from repository: ", pendingPost);
        if (pendingPost.status !== Status.PENDING) {
            throw Error('Pending Post is not pending anymore!');
        }
        console.log("ENTERRED CANCEL PENDING");
        const originalPost = await PostRepository.getPostById(pendingPost.sourcePost);
        const content = originalPost.content;
        const updatedContent = [];
        const groceries = pendingPost.content;        
        for (grocery in content) {
            console.log("grocery from post: ", content[grocery]);
            var isThere = false;
            for (newGrocery in groceries) {
                console.log("grocery from array: ", groceries[newGrocery]);
                if(groceries[newGrocery].name === content[grocery].name) {
                    isThere = true;
                    amount = content[grocery].amount + groceries[newGrocery].amount;
                    updatedContent.push({
                        "name": content[grocery].name,
                        "amount": amount,
                        "scale": content[grocery].scale,
                        "packing": content[grocery].packing,
                        "category": content[grocery].category
                    });
                }
            }
            if (!isThere) {
                updatedContent.push(content[grocery]);
            }
        }
        console.log(updatedContent);
        await PostRepository.updateContent(originalPost._id, updatedContent);
        const updatedPost = await PostRepository.getPostById(pendingPost.sourcePost);

        await Repository.updatePostStatus(pendingPostId, Status.CANCELLED);

        const cancelledPost = await Repository.getPostById(pendingPostId);

        return {cancelledPost, updatedPost};
    } catch (e) {
        console.log('service error from cancelPending: ', e.message);

        throw Error(e);
    }
};

interrestedUserReminder = async (userId, postId) => {
    try {
        const user = await UserRepository.getUserById(userId);
        console.log("ENTERRED REMINDER");
        
        const decide = async function () {
            console.log("ENTERRED DECIDE with id: ", postId);
            const post = await Repository.getPostById(postId);
            if(post.status === Status.PENDING) {
                console.log("status from interrestedUserReminder: ", post.status);
                console.log("WILL CALL NOW CANCEL PENDING POST");
                let {cancelledPost, updatedPost} = await cancelPending(postId);
            }
            return;
        }

        const remind = async (phone) => {
            console.log("TAKEN???"); //SEND TO CELLULAR/PUSH NOTIFICATION
            setTimeout(async function() {await decide()}, oneHour/4);
            return;
        }

        setTimeout(async function() {await remind(user.phone)}, oneHour*(3/4));
    } catch (e) {
        console.log('service error from interrestedUserReminder: ', e.message);

        throw Error(e.message);
    }
};

module.exports = {
    getPosts,
    getPostById,
    getPostsByUser,
    getPostsByCategory,
    getPostsByTag,
    getPostsByCollector,
    getAllFinishedPosts,
    getAllPendingPosts,
    getAllCancelledPosts,
    addPending,
    finishPending,
    cancelPending,
    deletePost,
    updatePost
}
