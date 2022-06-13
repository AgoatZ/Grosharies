const express = require('express');
const { status } = require('express/lib/response');
const PendingRepository = require('./pending.repository');
const GroceryRepository = require('../grocery/grocery.repository');
const UserRepository = require('../user/user.repository');
const PostRepository = require('../post/post.repository');
const UserService = require('../user/user.services');
const oneHour = 60 * 60 * 60 * 1000;
const Status = require('../enums/pending-status');
const postStatus = require('../enums/post-status');
const { StartExecutionCommand } = require('@aws-sdk/client-sfn');
const { sfnClient } = require('../common/utils/sfn-client');

const getPendings = async function (query, page, limit) {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { 'pendingTime.from' : -1}
            };
        } else {
            options = { pagination: false }
        }
        const posts = await PendingRepository.getPendings(query, options);
        return posts;
    } catch (e) {
        console.log('Pending service error from getPendings: ', e.message);

        throw Error('Error while Retrieving Pendings');
    }
};

const getGroupedPendings = async function (page, limit) {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { 'pendingTime.from' : -1}
            };
        } else {
            options = { pagination: false }
        }
        const cancelledPendings = await PendingRepository.getAllCancelledPosts(options);
        const finishedPendings = await PendingRepository.getAllFinishedPosts(options);
        const pendingPosts = await PendingRepository.getAllPendingPosts(options);
        return { pendingPosts, finishedPendings, cancelledPendings };
    } catch (e) {
        console.log('Pending service error from getGropuedPendings: ', e.message);

        throw Error('Error while Retrieving Pendings');
    }
};

const getPendingById = async function (postId) {
    try {
        const post = await PendingRepository.getPendingById(postId);
        return post;
    } catch (e) {
        console.log('Pending service error from getPendingById: ', e.message);

        throw Error('Error while Retrieving Pending');
    }
};

const getPendingsByPublisher = async function (publisherId, user, page, limit) {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { 'pendingTime.from' : -1}
            };
        } else {
            options = { pagination: false }
        }
        let userId;
        if (userId == 'current' && user) {
            userId = user._id;
            //console.log("Service bypublisher from user._id userId:", userId)
        } else {
            userId = publisherId;
            //console.log("Service bypublisher from params userId:", userId)
        }
        const { pendingPosts, finishedPendings, cancelledPendings } = await PendingRepository.getPendingsByPublisher(userId, options);
        return { pendingPosts, finishedPendings, cancelledPendings };
    } catch (e) {
        console.log('Pending service error from getPendingsByUser: ', e.message);

        throw Error('Error while Retrieving Pendings by User');
    }
};

const getPendingsByCollector = async function (collectorId, user, page, limit) {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { 'pendingTime.from' : -1}
            };
        } else {
            options = { pagination: false }
        }
        let userId;
        if (collectorId == 'current' && user) {
            userId = user._id;
            //console.log("Service bypublisher from user._id userId:", userId)
        } else {
            userId = collectorId;
            //console.log("Service bypublisher from params userId:", userId)
        }
        const { pendingPosts, finishedPendings, cancelledPendings } = await PendingRepository.getPendingsByCollector(userId, options);
        return { pendingPosts, finishedPendings, cancelledPendings };
    } catch (e) {
        console.log('Pending service error from getPendingsByCollector: ', e.message);

        throw Error('Error while Retrieving Pendings by Collector');
    }
};

const getPendingsByCategory = async function (categoryId, page, limit) {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { 'pendingTime.from' : -1}
            };
        } else {
            options = { pagination: false }
        }
        const posts = await PendingRepository.getPendingsByCategory(categoryId, options);
        return posts;
    } catch (e) {
        console.log('Pending service error from getPendingsByCategory: ', e.message);

        throw Error('Error while Retrieving Pendings by Category');
    }
};

const getPendingsByTag = async function (tagId, page, limit) {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { 'pendingTime.from' : -1}
            };
        } else {
            options = { pagination: false }
        }
        const posts = await PendingRepository.getPendingsByTag(tagId, options);
        return posts;
    } catch (e) {
        console.log('Pending service error from getPendingsByTag: ', e.message);

        throw Error('Error while Retrieving Pendings by Tag');
    }
};

const getPendingsByPost = async function (postId, page, limit) {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { 'pendingTime.from' : -1}
            };
        } else {
            options = { pagination: false }
        }
        const posts = await PendingRepository.getPendingsByPost(postId, options);
        return posts;
    } catch (e) {
        console.log('Pending service error from getPendingsByPost: ', e.message);

        throw Error('Error while Retrieving Pendings by Tag');
    }
};

const addPending = async function (postDetails) {
    try {
        const pendingPost = await PendingRepository.addPending(postDetails);
        await interrestedUserReminder(pendingPost.collectorId, pendingPost._id);

        return pendingPost;
    } catch (e) {
        console.log('Pending service error from addPending: ', e.message);

        throw Error('Error while Adding Pendings');
    }
};

const deletePending = async function (postId) {
    try {
        const deletedPost = await PendingRepository.deletePending(postId);
        return deletedPost;
    } catch (e) {
        console.log('Pending service error from deletePending: ', e.message);

        throw Error('Error while Deleting Pendings');
    }
};

const getAllPendingPosts = async function (page, limit) {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { 'pendingTime.from' : -1}
            };
        } else {
            options = { pagination: false }
        }
        const pendingPosts = await PendingRepository.getAllPendingPosts(options);
        return pendingPosts;
    } catch (e) {
        console.log('Pending service error from getAllPendingPosts: ', e.message);

        throw Error('Error while Retrieving Pending Posts');
    }
};

const getAllFinishedPosts = async function (page, limit) {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { 'pendingTime.from' : -1}
            };
        } else {
            options = { pagination: false }
        }
        const finishedPosts = await PendingRepository.getAllFinishedPosts(options);
        return finishedPosts;
    } catch (e) {
        console.log('Pending service error from getAllFinishedPosts: ', e.message);

        throw Error('Error while Retrieving Collected Posts');
    }
};

const getAllCancelledPosts = async function (page, limit) {
    try {
        let options;
        if (page && limit) {
            options = {
                page: page,
                limit: limit,
                sort: { 'pendingTime.from' : -1}
            };
        } else {
            options = { pagination: false }
        }
        const finishedPosts = await PendingRepository.getAllCancelledPosts(options);
        return finishedPosts;
    } catch (e) {
        console.log('Pending service error from getAllCancelledPosts: ', e.message);

        throw Error('Error while Retrieving Cancelled Posts');
    }
};

const updatePending = async function (pendingId, pendingDetails) {
    try {
        const oldPending = await PendingRepository.updatePending(pendingId, pendingDetails);
        const updatedPending = await PendingRepository.getPendingById(pendingId);
        const post = await PostRepository.getPostById(oldPending.sourcePost);

        const updatedContent = [];
        const content = post.content;
        const groceries = updatedPending.content;
        const amountsToReduce = new Map();
        let hasChanged = false;
        for (let i in groceries) {
            for (let j in oldPending.content) {
                if (groceries[i].name === oldPending.content[j].name) {
                    amountsToReduce.set(groceries[i].name, groceries[i].amount - oldPending.content[j].amount);
                    if (amountsToReduce.get(groceries[i].name) > 0) {
                        flag = true;
                    }
                }
            }
        }
        if (hasChanged) {
            for (groceryIndex in content) {
                let grocery = content[groceryIndex];
                let isThere = false;
                for (wantedGroceryIndex in groceries) {
                    let wantedGrocery = groceries[wantedGroceryIndex];
                    if (wantedGrocery.name == grocery.original.name) {
                        //reduce amount and creat json for updating
                        isThere = true;
                        let left = grocery.left - amountsToReduce.get(wantedGrocery.name);
                        if (left < 0 || left > grocery.original.amount) {
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
            //console.log('updatedContent: ', updatedContent);
            await PostRepository.updatePost(post._id, { content: updatedContent });

            const updatedPost = await PostRepository.getPostById(post._id);
        }
        return oldPending;
    } catch (e) {
        console.log('Pending service error from updatePending: ', e.message);

        throw Error('Error while Updating Pendings');
    }
};

const setCollectorStatement = async function (pendingId, user) {
    try {
        let pending = await PendingRepository.getPendingById(pendingId);
        if (user && !user._id.equals(pending.collectorId)) {
            throw Error('This user is not allowed to do that');
        }
        const oldPending = await PendingRepository.updatePending(pendingId, { 'status.collectorStatement': "collected" });
        pending = await PendingRepository.getPendingById(pendingId);
        if (pending.pendingTime.until < Date.now()) {
            await decide(pending);
        }

        return oldPending;
    } catch (e) {
        console.log('Pending service error from setCollectorStatement: ', e.message);

        throw Error('Error while changing statement Posts');
    }
};

const finishPending = async function (pendingPostId, user) {
    try {
        let pendingPost = await PendingRepository.getPendingById(pendingPostId);
        if (!pendingPost.status.finalStatus == Status.PENDING) {
            throw Error('Pending Post is not pending anymore!');
        }
        if (user && !user._id.equals(pendingPost.publisherId) && !user._id.equals(pendingPost.collectorId)) {
            throw Error('This user is not allowed to do that');
        }
        if (user && user._id.equals(pendingPost.collectorId)) {
            return await setCollectorStatement(pendingPostId, user);
        }
        const trafficGroceries = [];
        const content = pendingPost.content;
        let rank = 0;
        for (groceryIndex in content) {
            let grocery = content[groceryIndex];
            let trafficGrocery = await GroceryRepository.getGroceryByName(grocery.name);
            let newAmount = grocery.amount + trafficGrocery.amount;
            rank += grocery.amount;
            await GroceryRepository.updateGrocery(trafficGrocery._id, { amount: newAmount });
            trafficGrocery = await GroceryRepository.getGroceryByName(grocery.name);
            trafficGroceries.push(trafficGrocery);
        }
        await PendingRepository.updatePending(pendingPostId, { 'status.finalStatus': Status.COLLECTED });
        console.log(rank);
        const publisher = await UserRepository.getUserById(pendingPost.publisherId);
        await UserRepository.updateUser(publisher._id, { rank: publisher.rank + rank });
        const collector = await UserRepository.getUserById(pendingPost.collectorId);
        await UserRepository.updateUser(collector._id, { rank: collector.rank + rank });

        const postCurrentStatus = await evaluatePostStatus(pendingPost.sourcePost);
        console.log(postCurrentStatus);
        await PostRepository.updatePost(pendingPost.sourcePost, { status: postCurrentStatus });
        const finishedPending = await PendingRepository.getPendingById(pendingPostId);

        return { finishedPending, trafficGroceries };
    } catch (e) {
        console.log('Pending service error from finishPending:', e.message);

        throw Error('Error while Finnishing Pending');
    }
};

const cancelPending = async function (pendingPostId, user) {
    try {
        let pendingPost = await PendingRepository.getPendingById(pendingPostId);
        if (!pendingPost.status.finalStatus == Status.PENDING) {
            throw Error('Pending Post is not pending anymore!');
        }
        if (user) {
            if (user._id.equals(pendingPost.collectorId)) {
                await PendingRepository.updatePending(pendingPostId, { 'status.collectorStatement': "cancelled" });
            }
            else if (user._id.equals(pendingPost.publisherId)) {
                await PendingRepository.updatePending(pendingPostId, { 'status.publisherStatement': "cancelled" });
            }
        }
        console.log("ENTERRED CANCEL PENDING");
        const originalPost = await PostRepository.getPostById(pendingPost.sourcePost);
        const content = originalPost.content;
        const updatedContent = [];
        const groceries = pendingPost.content;
        for (groceryIndex in content) {
            let grocery = content[groceryIndex];
            let isThere = false;
            for (wantedGroceryIndex in groceries) {
                let wantedGrocery = groceries[wantedGroceryIndex];
                if (wantedGrocery.name == grocery.name) {
                    isThere = true;
                    let left = grocery.left + wantedGrocery.amount;
                    if (left > grocery.original.amount) {
                        throw Error('Left is higher than original');
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
        await PostRepository.updatePost(originalPost._id, { content: updatedContent });
        const updatedPost = await PostRepository.getPostById(pendingPost.sourcePost);

        await PendingRepository.updatePending(pendingPostId, { 'status.finalStatus': Status.CANCELLED });

        const cancelledPost = await PendingRepository.getPendingById(pendingPostId);

        return { cancelledPost, updatedPost };
    } catch (e) {
        console.log('Pending service error from cancelPending: ', e.message);

        throw Error('Error while Cancelling Pending');
    }
};

const decide = async (pendingId) => {
    console.log(pendingId);
    console.log('decide for pendingId:', pendingId);
    const pending = await PendingRepository.getPendingById(pendingId);
    if (pending) {
        console.log('decide for address:', pending.address);
        const publisherStatement = pending.status.publisherStatement;
        const collectorStatement = pending.status.collectorStatement;
        if (publisherStatement == Status.PENDING && collectorStatement == Status.PENDING) {
            console.log("WILL CALL NOW CANCEL PENDING POST");
            let { cancelledPost, updatedPost } = await cancelPending(pending._id, false);
        }
        else if (publisherStatement == Status.CANCELLED || collectorStatement == Status.CANCELLED) {
            let { cancelledPost, updatedPost } = await cancelPending(pending._id, false);
        }
        else {
            let { finishedPending, trafficGroceries } = await finishPending(pending._id, false);
        }
    }
    return;
}

const interrestedUserReminder = async (userId, pendingId) => {
    try {
        const user = await UserRepository.getUserById(userId);
        const pending = await PendingRepository.getPendingById(pendingId);
        const publisher = await UserRepository.getUserById(pending.publisherId);

        let content = '';
        for (i in pending.content) {
            content += (pending.content[i].amount + ' ' + pending.content[i].name + ',');
        }
        content = content.slice(0, -1);

        const remind = async (recieverNumber, publisherNumber) => {
            console.log("TAKEN???"); //SEND TO CELLULAR/PUSH NOTIFICATION
            //const collectorSMS = sendSMSToNumber(`Hey from Grosharies! Have you picked up the ${content}? Let us know!`, `Hey from Grosharies! How was your experience at ${pending.address} with ${publisher.firstName} ${publisher.lastName}? Tell us what you feel!`, recieverNumber);
            //const publisherSMS = sendSMSToNumber(`Hey from Grosharies! Have you delivered the ${content}? Let us know!`, `Hey from Grosharies! How was your experience at ${pending.address} with ${user.firstName} ${user.lastName}? Tell us what you feel!`, publisherNumber);
            const delayedUpdate = delayUpdate(pendingId);
            delayedUpdate.catch(err => console.log('AWS delayUpdate failed', err));
            //await decide(pending);
            //const reToId = setTimeout(async function () { await decide(pending) }, (oneHour / 240));
            //reToId.hasRef();
            return;
        };
        if (user && publisher) {
            await remind(user.phone, publisher.phone);
        }
        //const toId = setTimeout(async function () { await remind(user.phoneNumber, publisher.phoneNumber) }, (oneHour / 240));
        //toId.hasRef();
    } catch (e) {
        console.log('Pending service error from interrestedUserReminder: ', e.message);

        throw Error('Error while Reminding User');
    }
};

const sendSMSToNumber = async (firstMessage, secondMessage, phoneNumber) => {
    const r = Date.now() + Math.round(Math.random() * 1E9);
    var params = {
        stateMachineArn: process.env.AWS_SFN_SENDSMS_ARN,
        input: JSON.stringify({
            FirstMessage: firstMessage,
            SecondMessage: secondMessage,
            PhoneNumber: phoneNumber
        }),
        name: `${phoneNumber}-${r}`
    };

    const run = async () => {
        try {
            const command = new StartExecutionCommand(params);
            const response = await sfnClient.send(command);
            console.log("Success sending SMS.", response);
            return response; // For unit tests.
        } catch (err) {
            console.log("Error sending SMS", err.stack);
        }
    };
    return run();
};

const delayUpdate = async (id) => {
    const r = Date.now() + Math.round(Math.random() * 1E9);
    var params = {
        stateMachineArn: process.env.AWS_SFN_DELAYUPDATE_ARN,
        input: JSON.stringify({
            Id: id
        }),
        name: `${id}-${r}`
    };

    const run = async () => {
        try {
            const command = new StartExecutionCommand(params);
            const response = await sfnClient.send(command);
            console.log("Success sending SMS.", response);
            return response; // For unit tests.
        } catch (err) {
            console.log(response);
            console.log(command);
            console.log("Error sending SMS", err.stack);
        }
    };
    return run();
};

const evaluatePostStatus = async (postId) => {
    try {
        const post = await PostRepository.getPostById(postId);
        const pendings = await getPendingsByPost(postId);
        let empty = true;
        let full = true;
        
        for (groceryIndex in post.content) {
            let grocery = post.content[groceryIndex];
            if (grocery.left != grocery.original.amount) {
                full = false;
            }
            if (grocery.left != 0) {
                empty = false;
            }
        }

        if (!empty && !full) {
            return postStatus.PARTIALLY_COLLECTED;
        }

        else if (full) {
            return postStatus.STILL_THERE;
        }

        else { //if empty, check whether all pendings have finished
            for (pended in pendings) {
                if (pendings[pended].status.finalStatus == Status.PENDING) {
                    return postStatus.PARTIALLY_COLLECTED;
                }
            }
            return postStatus.COLLECTED;
        }
    } catch (e) {
        console.log('Pending service error from evaluatePostStatus:', e.message);

        throw Error('Error while evaluating post status');
    }
};

module.exports = {
    getPendings,
    getGroupedPendings,
    getPendingById,
    getPendingsByPublisher,
    getPendingsByCategory,
    getPendingsByTag,
    getPendingsByPost,
    getPendingsByCollector,
    getAllFinishedPosts,
    getAllPendingPosts,
    getAllCancelledPosts,
    interrestedUserReminder,
    addPending,
    decide,
    sendSMSToNumber,
    delayUpdate,
    finishPending,
    cancelPending,
    deletePending,
    updatePending,
    evaluatePostStatus,
    setCollectorStatement
}
