const express = require('express');
const { status } = require('express/lib/response');
const Post = require('./post.model');
const reply = require('../enums/post-reply');
const postStatus = require('../enums/post-status');

const getPosts = async (query, options) => {
    try {
        const posts = await Post.paginate(query, options);
        return posts.docs;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Posts: ' + e.message);
    }
};

const getRelevantPosts = async (options) => {
    try {
        const posts = await Post.paginate({
            $and: [
                { 'pickUpDates.from': { $lt: Date.now() } },
                { 'pickUpDates.until': { $gt: Date.now() } }
            ]
        }, options);
        return posts.docs;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Posts: ' + e.message);
    }
};

const getPublisherOpenPosts = async (publisherId, options) => {
    try {
        const posts = await Post.paginate({
            $and: [
                { userId: publisherId },
                { status: { $in: [postStatus.PARTIALLY_COLLECTED, postStatus.STILL_THERE] } }
            ]
        }, options);
        return posts.docs;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Posts: ' + e.message);
    }
};

const getPostById = async (postId) => {
    try {
        const post = await Post.findById(postId);
        return post;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

const getPostsByUser = async (userId, options) => {
    try {
        const posts = await Post.paginate({ 'userId': userId }, options);
        return posts.docs;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

const getPostsByCategory = async (categoryId, options) => {
    try {
        const posts = await Post.paginate({ 'content': { 'category': categoryId } }, options);
        return posts.docs;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

const getPostsByTag = async (tagId, options) => {
    try {
        const posts = await Post.paginate({ 'tags': tagId }, options);
        return posts.docs;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

const getPostsByCollector = async (userId, options) => {
    try {
        const posts = await Post.paginate({ 'repliers': { 'user': userId, 'reply': reply.PARTIALLY_TOOK || reply.TOOK } }, options);
        return posts.docs;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

const getPostsByGroceries = async (groceries, options) => {
    try {
        const posts = await Post.paginate({
            $and: [
                {},
            { 'content.original.name': { $in: groceries }}
            ]
        }, options);
        //where('content.original.name').in(groceries);
        return posts.docs;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

const addPost = async (postDetails) => {
    try {
        const post = new Post(postDetails);
        return await post.save();
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Adding Post: ' + e.message);
    }
};

const deletePost = async (postId) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        return deletedPost;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Deleting Post: ' + e.message);
    }
};

const updatePost = async (postId, postDetails) => {
    try {
        //console.log('repo update post: ', JSON.stringify(postDetails));
        let post = await Post.findByIdAndUpdate(postId, postDetails);
        post = await Post.findById(postId);
        return post;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Updating Post: ' + e.message);
    }
};

const updateContent = async (postId, content) => {
    try {
        const oldPost = await Post.findByIdAndUpdate(postId, { content: content });
        return oldPost;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Updating Post: ' + e.message);
    }
};

const searchPosts = async (searchValue, options) => {
    console.log('searching');
    const regex = new RegExp(searchValue, 'i');
    const filteredPosts = await Post.paginate({
        $or: [
            { name: { "$regex": regex } },
            { 'content.original.name': { "$regex": regex } }
        ]
    }, options);
    console.log(regex);
    return filteredPosts.docs;
};
  
module.exports = {
    getPosts,
    getPostById,
    getPostsByUser,
    getPostsByCategory,
    getPostsByTag,
    getPostsByCollector,
    getPostsByGroceries,
    getRelevantPosts,
    getPublisherOpenPosts,
    addPost,
    deletePost,
    updatePost,
    updateContent,
    searchPosts
};