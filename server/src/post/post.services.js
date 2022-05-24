const express = require('express');
const { status } = require('express/lib/response');
const PostRepository = require('./post.repository');
const GroceryRepository = require('../grocery/grocery.repository');
const PendingService = require('../pending/pending.services');
const UserService = require('../user/user.services');
const TagService = require('../tag/tag.services');
const TagRepository = require('../tag/tag.repository');
const Grocery = require('../grocery/grocery.model');
const router = express.Router();
const SuggestionsUtil = require('../common/utils/suggestions-util');
const PendingStatus = require('../enums/pending-status');

const getPosts = async (query, page, limit) => {
    try {
        const posts = await PostRepository.getPosts(query);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Posts');
    }
};

const getPostById = async (postId) => {
    try {
        const post = await PostRepository.getPostById(postId);
        return post;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Post');
    }
};

const getPostsByUser = async (publisherId, user) => {
    try {
        let userId;
        if (publisherId == 'current' && user) {
            userId = user._id;
            console.log("Post Service byUser from user._id userId:", userId);
        } else {
            userId = publisherId;
            console.log("Post Service byUser from params userId:", userId);
        }
        const posts = await PostRepository.getPostsByUser(userId);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Posts by User');
    }
};

const getPublisherOpenPosts = async (publisherId, user) => {
    try {
        let userId;
        if (publisherId == 'current' && user) {
            userId = user._id;
            console.log("Post Service getPublisherOpenPosts from user._id userId:", userId);
        } else {
            userId = publisherId;
            console.log("Post Service getPublisherOpenPosts from params userId:", userId);
        }
        const posts = await PostRepository.getPublisherOpenPosts(userId);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Posts by User');
    }
};

const getPostsByCategory = async (categoryId) => {
    try {
        const posts = await PostRepository.getPostsByCategory(categoryId);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Posts by Category');
    }
};

const getPostsByTag = async (tagId) => {
    try {
        const posts = await PostRepository.getPostsByTag(tagId);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Posts by Tag');
    }
};

const getPostsByCollector = async (userId, user) => {
    try {
        let userId;
        if (userId == 'current' && user) {
            userId = user._id;
            //console.log("Service bypublisher from user._id userId:", userId)
        } else {
            userId = userId;
            //console.log("Service bypublisher from params userId:", userId)
        }
        const posts = await PostRepository.getPostsByCollector(userId);
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Posts by Collector');
    }
};

const getPostsByGroceries = async (groceries) => {
    try {
        const posts = await PostRepository.getPostsByGroceries(groceries);
        return posts;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Posts by Collector');
    }
};

const addPost = async (postDetails) => {
    try {
        postDetails.content.left = postDetails.content.original.amount;
        const post = await PostRepository.addPost(postDetails);

        return post;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Adding Post');
    }
};

const deletePost = async (postId) => {
    try {
        const deletedPost = await PostRepository.deletePost(postId);
        return deletedPost;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Deleting Post');
    }
};

const updatePost = async (postId, postDetails) => {
    try {
        if (postDetails.image) {
            postDetails.images = postDetails.image;
            delete postDetails['image'];
        }
        const oldPost = await PostRepository.updatePost(postId, postDetails);
        return oldPost;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Updating Post');
    }
};

const pendPost = async (postId, collectorId, groceries) => {
    try {
        const post = await PostRepository.getPostById(postId);
        const updatedContent = [];
        const content = post.content;

        for (groceryIndex in content) {
            let grocery = content[groceryIndex];
            let isThere = false;
            for (wantedGroceryIndex in groceries) {
                let wantedGrocery = groceries[wantedGroceryIndex];
                if (wantedGrocery.name === grocery.original.name) {
                    //reduce amount and creat json for updating
                    isThere = true;
                    let left = grocery.left - wantedGrocery.amount;
                    if (left < 0) {
                        throw Error('Requested amount is higher than available');
                    }
                    updatedContent.push({
                        original: grocery.original,
                        left: left
                    });
                }
            }
            if (!isThere) {
                updatedContent.push(grocery);
            }
        }
        await PostRepository.updatePost(postId, { content: updatedContent });

        const oneHour = 60 * 60 * 1000;
        const pendingPost = await PendingService.addPending({
            headline: post.headline,
            address: post.address,
            content: groceries,
            sourcePost: post._id,
            publisherId: post.userId,
            collectorId: collectorId,
            pendingTime: {
                from: Date.now(),
                until: Date.now() + oneHour
            }
        });
        const collector = await UserService.addToHistory(collectorId, pendingPost._id);

        const updatedPost = await PostRepository.getPostById(postId);

        return { updatedPost, pendingPost };
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Pending Post');
    }
};

const getPostTags = async (postId) => {
    try {
        const post = await PostRepository.getPostById(postId);
        const tags = [];
        for (tagId in post.tags) {
            const tag = await TagRepository.getTagById(post.tags[tagId]);
            tags.push(tag);
        }
        return tags;
    } catch (e) {
        throw Error('Error while retrieving tags');
    }
};

const getSuggestedPosts = async (id, currentUser) => {
    console.log('sugestservice');
    try {
        let userId;
        if (id == 'current' && currentUser) {
            userId = currentUser._id;
            //console.log("Service bypublisher from user._id userId:", userId)
        } else {
            userId = id;
            //console.log("Service bypublisher from params userId:", userId)
        }
        var posts = await PostRepository.getRelevantPosts();
        const user = await UserService.getUserById(userId);
        const history = [];
        for (pendingId in user.collectedHistory) {
            let id = user.collectedHistory[pendingId];
            let pending = await PendingService.getPendingById(id);
            history.push(pending);
        }
        const relevanceMap = new Map();
        for (post in posts) {
            let rPost = posts[post];
            let postRelevance = await SuggestionsUtil.getPostRelevance(history, rPost);
            relevanceMap.set(rPost, postRelevance);
            console.log(relevanceMap);
        }
        return posts.sort((p1, p2) => relevanceMap.get(p2) - relevanceMap.get(p1));
    } catch (e) {
        throw Error('Error while suggesting posts');
    }
};

module.exports = {
    getPosts,
    getPostById,
    getPostsByUser,
    getPostsByCategory,
    getPostsByTag,
    getPostsByCollector,
    getPostsByGroceries,
    getSuggestedPosts,
    getPublisherOpenPosts,
    addPost,
    pendPost,
    deletePost,
    updatePost,
};