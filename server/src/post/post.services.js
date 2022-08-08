const express = require('express');
const { status } = require('express/lib/response');
const PostRepository = require('./post.repository');
const PostStatus = require('../enums/post-status');
const PendingService = require('../pending/pending.services');
const UserService = require('../user/user.services');
const TagRepository = require('../tag/tag.repository');
const SuggestionsUtil = require('../common/utils/suggestions-util');
const GroceryRepository = require('../grocery/grocery.repository');
const { getCoordinates } = require('../common/utils/google-maps-client');

const getPosts = async (query, page, limit) => {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { publishingDate: -1 }
            };
        } else {
            options = { pagination: false }
        }
        const posts = await PostRepository.getPosts(query, options);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Posts');
    }
};

const getPostById = async (postId) => {
    try {
        let post = await PostRepository.getPostById(postId);
        if (!(post.addressCoordinates.lat && post.addressCoordinates.lng)) {
            let coordinates = await getCoordinates(post.address);
            await PostRepository.updatePost(postId, { addressCoordinates: { lat: coordinates.lat, lng: coordinates.lng } });
            post = await PostRepository.getPostById(postId);
        }
        return post;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Post');
    }
};

const getPostsByUser = async (publisherId, user, page, limit) => {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { publishingDate: -1 }
            };
        } else {
            options = { pagination: false }
        }
        let userId;
        if (publisherId == 'current' && user) {
            userId = user._id;
        } else {
            userId = publisherId;
        }
        const posts = await PostRepository.getPostsByUser(userId, options);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Posts by User');
    }
};

const getPublisherOpenPosts = async (publisherId, user, page, limit) => {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { publishingDate: -1 }
            };
        } else {
            options = { pagination: false }
        }
        let userId;
        if (publisherId == 'current' && user) {
            userId = user._id;
        } else {
            userId = publisherId;
        }
        const posts = await PostRepository.getPublisherOpenPosts(userId, options);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Posts by User');
    }
};

const getPostsByCategory = async (categoryId, page, limit) => {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { publishingDate: -1 }
            };
        } else {
            options = { pagination: false }
        }
        const posts = await PostRepository.getPostsByCategory(categoryId, options);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Posts by Category');
    }
};

const getPostsByTag = async (tagId, page, limit) => {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { publishingDate: -1 }
            };
        } else {
            options = { pagination: false }
        }
        const posts = await PostRepository.getPostsByTag(tagId, options);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Posts by Tag');
    }
};

const getPostsByCollector = async (collectorId, user, page, limit) => {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { publishingDate: -1 }
            };
        } else {
            options = { pagination: false }
        }
        let userId;
        if (userId == 'current' && user) {
            userId = user._id;
        } else {
            userId = collectorId;
        }
        const posts = await PostRepository.getPostsByCollector(userId, options);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Posts by Collector');
    }
};

const getPostsByGroceries = async (groceries, page, limit) => {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { publishingDate: -1 }
            };
        } else {
            options = { pagination: false }
        }
        const posts = await PostRepository.getPostsByGroceries(groceries, options);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Posts by Collector');
    }
};

const addPost = async (postDetails, user) => {
    try {
        //#TODO GETTING ONLY GROCERY ID AND CREATING HERE THE FULL OBJECT
        let repeated = false;
        if (postDetails.pickUpDates[0].repeated == 'on') {
            repeated = true;
        }
        let newPost = {
            headline: postDetails.headline,
            userId: user._id,
            address: postDetails.address,
            pickUpDates: [{
                from: postDetails.pickUpDates[0].from,
                until: postDetails.pickUpDates[0].until,
                repeated: repeated
            }],
            status: PostStatus.STILL_THERE,
            content: [],
            description: postDetails.description,
        };
        for (i in postDetails.groceriesToSend) {
            if (postDetails.groceriesToSend[i]) {
                let grocery = await GroceryRepository.getGroceryById(postDetails.groceriesToSend[i].id);
                let amount = postDetails.groceriesToSend[i].amount;
                delete grocery['_id'];
                grocery.amount = amount;
                newPost.content.push({
                    original: grocery,
                    left: amount
                });
            }
        }

        let coordinates = await getCoordinates(postDetails.address);
        newPost.addressCoordinates = { lat: coordinates.lat, lng: coordinates.lng };
        const post = await PostRepository.addPost(newPost);
        return post;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Adding Post');
    }
};

const deletePost = async (postId) => {
    try {
        const deletedPost = await PostRepository.getPostById(postId);
        await PostRepository.updatePost(postId, { status: "cancelled" });
        for (i in deletedPost.repliers) {
            await PendingService.cancelPending(deletedPost.repliers[i].reply).catch(err => console.log(err));
        }
        return deletedPost;
    } catch (e) {
        console.log("Post Service error from deletePost:", e.message);

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
        if (post.status == PostStatus.CANCELLED || post.status == PostStatus.COLLECTED)
            throw Error('This post is not open for new orders, status:', post.status);
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
                        throw Error("Requested amount is higher than available");
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

        const oneHour = 60 * 60 * 1000;
        const pendingPost = await PendingService.addPending({
            headline: post.headline,
            address: post.address,
            addressCoordinates: post.addressCoordinates,
            content: groceries,
            sourcePost: post._id,
            publisherId: post.userId,
            collectorId: collectorId,
            pendingTime: {
                from: Date.now(),
                until: Date.now() + oneHour
            }
        });
        let exists = false;
        for (i in post.repliers) {
            if (post.repliers[i] == collectorId) {
                exists = true;
            }
        }
        if (!exists) {
            post.repliers.push({ user: collectorId, reply: pendingPost._id });
        }
        await PostRepository.updatePost(postId, { content: updatedContent, repliers: post.repliers });

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

//TODO: DECIDE HOW TO HANDLE PAGINATION
const getSuggestedPosts = async (id, currentUser, page, limit) => {
    try {
        let options;
        if (page && limit) {
            options = { page: page, limit: limit };
        } else {
            options = { pagination: false }
        }
        let userId;
        if (id == 'current' && currentUser) {
            userId = currentUser._id;
        } else {
            userId = id;
        }
        var posts = await PostRepository.getRelevantPosts(options);
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
        }
        return posts.sort((p1, p2) => relevanceMap.get(p2) - relevanceMap.get(p1));
    } catch (e) {
        console.log('Service error from getSuggestedPosts', e);

        throw Error('Error while suggesting posts');
    }
};

const getNearbyPosts = async (coordinates, page, limit) => {
    try {
        let options;
        if (page && limit) {
            options = { page: page, limit: limit };
        } else {
            options = { pagination: false }
        }
        const posts = await PostRepository.getRelevantPosts(options);
        let nearbyPosts = [];
        for (i in posts) {
            let dist = coordinatesDistance(posts[i].addressCoordinates, coordinates);
            if (dist < 100000) {
                nearbyPosts.push(posts[i]);
            }
        }
        return nearbyPosts.sort((a, b) => coordinatesDistance(a.addressCoordinates, coordinates) - coordinatesDistance(b.addressCoordinates, coordinates));
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Posts');
    }
};

const searchPosts = async (searchValue, page, limit) => {
    let options;
    if (page && limit) {
        options = {
            page: page,
            limit: limit,
            sort: { publishingDate: -1 }
        };
    } else {
        options = { pagination: false }
    }
    const filteredPosts = await PostRepository.searchPosts(searchValue, options);
    return filteredPosts;
};

const getPostImages = async (postId) => {
    const post = await PostRepository.getPostById(postId);
    return post.images;
};

const coordinatesDistance = (coor1, coor2) => {
    const lat1 = coor1.lat;
    const lng1 = coor1.lng;
    const lat2 = coor2.lat;
    const lng2 = coor2.lng;
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
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
    getNearbyPosts,
    getPublisherOpenPosts,
    addPost,
    pendPost,
    deletePost,
    updatePost,
    searchPosts,
    getPostImages
};