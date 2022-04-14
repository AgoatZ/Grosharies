const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./pending.repository');
const GroceryRepository = require('../grocery/grocery.repository');
const UserRepository = require('../user/user.repository');
const PostRepository = require('../post/post.repository');
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
        const post = await Repository.addPost(postDetails);
        console.log('service: ' + post);

        return post;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

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
        const pendingPost = await Repository.getPostById(pendingPostId);
        if (!pendingPost.isPending) {
            throw Error('Pending Post is already finished!');
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
        pendingPost.isPending = false;
        await Repository.updatePost(pendingPostId, pendingPost);

        const finishedPost = await Repository.getPostById(pendingPostId);

        return {finishedPost, trafficGroceries};
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

interrestedUserReminder = async (userId, postId) => {
    const user = UserRepository.getUserById(userId);
    const remind = async (phone) => {
        console.log("TAKEN???"); //SEND TO CELLULAR/PUSH NOTIFICATION
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
    getAllFinishedPosts,
    getAllPendingPosts,
    addPending,
    finishPending,
    deletePost,
    updatePost
}
