const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./pending.repository');
const GroceryRepository = require('../grocery/grocery.repository');
const UserRepository = require('../user/user.repository');
const PostRepository = require('../post/post.repository');
const router = express.Router();
const timeToWait = 3000000;
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
        const pendingPost = await Repository.addPost(postDetails);
        interrestedUserReminder(pendingPost.collectorId, pendingPost._id);
        console.log('service: ' + post);

        return pendingPost;
    } catch (e) {
        console.log('service error: ' + e.message);

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
        const pendingPost = await Repository.getPostById(pendingPostId);
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
        pendingPost.status = Status.COLLECTED;
        await Repository.updatePost(pendingPostId, pendingPost);

        const finishedPost = await Repository.getPostById(pendingPostId);

        return {finishedPost, trafficGroceries};
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

cancelPending = async function (pendingPostId) {
    try {
        const pendingPost = await Repository.getPostById(pendingPostId);
        if (pendingPost.status !== Status.PENDING) {
            throw Error('Pending Post is not pending anymore!');
        }
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

        pendingPost.status = Status.CANCELLED;
        await Repository.updatePost(pendingPostId, pendingPost);

        const cancelledPost = await Repository.getPostById(pendingPostId);

        return {cancelledPost, updatedPost};
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

interrestedUserReminder = async (userId, postId) => {
    const user = UserRepository.getUserById(userId);
    
    const decide = async () => {
        const post = Repository.getPostById(postId);
        if(post.status === Status.PENDING) {
            cancelPending(postId);
        }
    }

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
    getAllCancelledPosts,
    addPending,
    finishPending,
    cancelPending,
    deletePost,
    updatePost
}
