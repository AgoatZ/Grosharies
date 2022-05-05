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
const timeToWait = 3000000;

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

const getPostsByUser = async (userId) => {
    try {
        const posts = await PostRepository.getPostsByUser(userId);
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

const getPostsByCollector = async (userId) => {
    try {
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
        const post = await PostRepository.addPost(postDetails);
        console.log('service: ' + post);

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

        for (grocery in content) {
            console.log("grocery from post: ", content[grocery]);
            var isThere = false;
            for (newGrocery in groceries) {
                console.log("grocery from array: ", groceries[newGrocery]);
                if (groceries[newGrocery].name === content[grocery].name) {
                    //reduce amount and creat json for updating
                    isThere = true;
                    amount = content[grocery].amount - groceries[newGrocery].amount;
                    if (amount < 0) {
                        throw Error('Requested amount is higher than available');
                    }
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
        await PostRepository.updateContent(postId, updatedContent);

        const oneHour = 60 * 60 * 1000;
        const pendingPost = await PendingService.addPending({
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

const getSuggestedPosts = async (userId) => {
    console.log('sugestservice');
    try {
        var posts = await PostRepository.getRelevantPosts();
        const user = await UserService.getUserById(userId);
        const history = [];
        for (pendingId in user.collectedHistory) {
            const pending = await PendingService.getPendingById(user.collectedHistory[pendingId]);
            history.push(pending);
        }
        const relevanceMap = new Map();
        for (post in posts) {
            const postRelevance = await SuggestionsUtil.getPostRelevance(history, posts[post]);
            relevanceMap.set(posts[post], postRelevance);
        }
        //console.log(relevanceMap);
        return posts.sort((p1,p2) => relevanceMap.get(p2) - relevanceMap.get(p1));
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
    addPost,
    pendPost,
    deletePost,
    updatePost
};