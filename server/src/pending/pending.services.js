const express = require('express');
const { status } = require('express/lib/response');
const PendingRepository = require('./pending.repository');
const GroceryRepository = require('../grocery/grocery.repository');
const UserRepository = require('../user/user.repository');
const PostRepository = require('../post/post.repository');
const UserService = require('../user/user.services');
const router = express.Router();
const oneHour = 60 * 60 * 60 * 1000;
const Status = require('../enums/pending-status');
const postStatus = require('../enums/post-status');
const { PublishCommand } = require('@aws-sdk/client-sns');
const { snsClient } = require('../common/utils/sns-client');

const getPendings = async function (query, page, limit) {
    try {
        const posts = await PendingRepository.getPendings(query);
        return posts;
    } catch (e) {
        console.log('Pending service error from getPendings: ', e.message);

        throw Error('Error while Retrieving Pendings');
    }
};

const getGroupedPendings = async function () {
    try {
        const cancelledPendings = await PendingRepository.getAllCancelledPosts();
        const finishedPendings = await PendingRepository.getAllFinishedPosts();
        const pendingPosts = await PendingRepository.getAllPendingPosts();
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

const getPendingsByPublisher = async function (req) {
    try {
        let userId;
        if (req.params.id.equals('current')) {
            userId = req.user._id;
            //console.log("Service bypublisher from user._id userId:", userId)
        } else {
            userId = req.params.id;
            //console.log("Service bypublisher from params userId:", userId)
        }
        const { pendingPosts, finishedPendings, cancelledPendings } = await PendingRepository.getPendingsByPublisher(userId);
        return { pendingPosts, finishedPendings, cancelledPendings };
    } catch (e) {
        console.log('Pending service error from getPendingsByUser: ', e.message);

        throw Error('Error while Retrieving Pendings by User');
    }
};

const getPendingsByCollector = async function (req) {
    try {
        let userId;
        if (req.params.id.equals('current')) {
            userId = req.user._id;
            //console.log("Service bycollector from user._id userId:", userId);
        } else {
            userId = req.params.id;
            //console.log("Service bycollector from params userId:", userId);
        }
        const { pendingPosts, finishedPendings, cancelledPendings } = await PendingRepository.getPendingsByCollector(userId);
        return { pendingPosts, finishedPendings, cancelledPendings };
    } catch (e) {
        console.log('Pending service error from getPendingsByCollector: ', e.message);

        throw Error('Error while Retrieving Pendings by Collector');
    }
};

const getPendingsByCategory = async function (categoryId) {
    try {
        const posts = await PendingRepository.getPendingsByCategory(categoryId);
        return posts;
    } catch (e) {
        console.log('Pending service error from getPendingsByCategory: ', e.message);

        throw Error('Error while Retrieving Pendings by Category');
    }
};

const getPendingsByTag = async function (tagId) {
    try {
        const posts = await PendingRepository.getPendingsByTag(tagId);
        return posts;
    } catch (e) {
        console.log('Pending service error from getPendingsByTag: ', e.message);

        throw Error('Error while Retrieving Pendings by Tag');
    }
};

const getPendingsByPost = async function (postId) {
    try {
        const posts = await PendingRepository.getPendingsByPost(postId);
        return posts;
    } catch (e) {
        console.log('Pending service error from getPendingsByPost: ', e.message);

        throw Error('Error while Retrieving Pendings by Tag');
    }
};

const addPending = async function (postDetails) {
    try {
        //console.log(postDetails);
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

const getAllPendingPosts = async function () {
    try {
        const pendingPosts = await PendingRepository.getAllPendingPosts();
        return pendingPosts;
    } catch (e) {
        console.log('Pending service error from getAllPendingPosts: ', e.message);

        throw Error('Error while Retrieving Pending Posts');
    }
};

const getAllFinishedPosts = async function () {
    try {
        const finishedPosts = await PendingRepository.getAllFinishedPosts();
        return finishedPosts;
    } catch (e) {
        console.log('Pending service error from getAllFinishedPosts: ', e.message);

        throw Error('Error while Retrieving Collected Posts');
    }
};

const getAllCancelledPosts = async function () {
    try {
        const finishedPosts = await PendingRepository.getAllCancelledPosts();
        return finishedPosts;
    } catch (e) {
        console.log('Pending service error from getAllCancelledPosts: ', e.message);

        throw Error('Error while Retrieving Cancelled Posts');
    }
};

//TODO: update all relevant data in db
const updatePending = async function (pendingId, pendingDetails) {
    try {
        const oldPending = await PendingRepository.updatePending(pendingId, pendingDetails);
        const updatedPending = await PendingRepository.getPendingById(pendingId);
        const post = await PostRepository.getPostById(oldPending.sourcePost);
        
        const updatedContent = [];
        const content = post.content;
        const groceries = updatedPending.content;
        const amountsToReduce = new Map();

        for (let i in groceries) {
            for (let j in oldPending.content) {
                if (groceries[i].name.equals(oldPending.content[j].name)) {
                    amountsToReduce.set(groceries[i].name, groceries[i].amount - oldPending.content[j].amount);
                }
            }
        }

        for (groceryIndex in content) {
            let grocery = content[groceryIndex];
            let isThere = false;
            for (wantedGroceryIndex in groceries) {
                let wantedGrocery = groceries[wantedGroceryIndex];
                if (wantedGrocery.name.equals(grocery.original.name)) {
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

        return oldPending;
    } catch (e) {
        console.log('Pending service error from updatePending: ', e.message);

        throw Error('Error while Updating Pendings');
    }
};

const setCollectorStatement = async function (pendingId, user) {
    try {
        const pending = await PendingRepository.getPendingById(pendingId);
        if (user && !user._id.equals(pending.collectorId)) {
            throw Error('This user is not allowed to do that');
        }
        const oldPending = await PendingRepository.updatePending(pendingId, { 'status.collectorStatement': "collected" });
        return oldPending;
    } catch (e) {
        console.log('Pending service error from setCollectorStatement: ', e.message);

        throw Error('Error while changing statement Posts');
    }
};

const finishPending = async function (pendingPostId, user) {
    try {
        let pendingPost = await PendingRepository.getPendingById(pendingPostId);
        if (!pendingPost.status.finalStatus.equals(Status.PENDING)) {
            throw Error('Pending Post is not pending anymore!');
        }
        if (user && !user._id.equals(pendingPost.publisherId) && !user._id.equals(pendingPost.collectorId)) {
            throw Error('This user is not allowed to do that');
        }
        if(user && user._id.equals(pendingPost.collectorId)) {
            return await setCollectorStatement(pendingPostId, user);
        }
        const trafficGroceries = [];
        const content = pendingPost.content;
        for (groceryIndex in content) {
            let grocery = content[groceryIndex];
            let trafficGrocery = await GroceryRepository.getGroceryByName(grocery.name);
            let newAmount = grocery.amount + trafficGrocery.amount;
            await GroceryRepository.updateGrocery(trafficGrocery._id, { amount: newAmount });
            trafficGrocery = await GroceryRepository.getGroceryByName(grocery.name);
            trafficGroceries.push(trafficGrocery);
        }
        await PendingRepository.updatePending(pendingPostId, { 'status.finalStatus': Status.COLLECTED });

        const postCurrentStatus = await evaluatePostStatus(pendingPost.sourcePost);
        await PostRepository.updatePost(pendingPost.sourcePost, { status: postCurrentStatus });
        const finishedPending = await PendingRepository.getPendingById(pendingPostId);

        return { finishedPending, trafficGroceries };
    } catch (e) {
        console.log('Pending service error from finishPending:', e.message);

        throw Error('Error while Finnishing Pending');
    }
};

const cancelPending = async function (pendingPostId) {
    try {
        //console.log("cacncelling ID: ", pendingPostId);
        let pendingPost = await PendingRepository.getPendingById(pendingPostId);
        //console.log("pendingPost at service from repository: ", pendingPost);
        if (!pendingPost.status.finalStatus.equals(Status.PENDING)) {
            throw Error('Pending Post is not pending anymore!');
        }
        console.log("ENTERRED CANCEL PENDING");
        const originalPost = await PostRepository.getPostById(pendingPost.sourcePost);
        const content = originalPost.content;
        const updatedContent = [];
        const groceries = pendingPost.content;
        for (groceryIndex in content) {
            let grocery = content[groceryIndex];
            //console.log("grocery from post: ", grocery);
            let isThere = false;
            for (wantedGroceryIndex in groceries) {
                let wantedGrocery = groceries[wantedGroceryIndex];
                //console.log("grocery from array: ", wantedGrocery);
                if (wantedGrocery.name.equals(grocery.name)) {
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
        //console.log(updatedContent);
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

const interrestedUserReminder = async (userId, pendingId) => {
    try {
        const user = await UserRepository.getUserById(userId);
        const pending = await PendingRepository.getPendingById(pendingId);
        const publisher = await UserRepository.getUserById(pending.publisherId);
        console.log("ENTERRED REMINDER");

        const decide = async () => {
            const publisherStatement = pending.status.publisherStatement;
            const collectorStatement = pending.status.collectorStatement;
            console.log("ENTERRED DECIDE with id: ", pendingId);
            if (publisherStatement.equals(Status.PENDING) && collectorStatement.equals(Status.PENDING)) {
                console.log("status from interrestedUserReminder: ", pending.status);
                console.log("WILL CALL NOW CANCEL PENDING POST");
                let { cancelledPost, updatedPost } = await cancelPending(pendingId);
            }
            else if (publisherStatement.equals(Status.CANCELLED) || collectorStatement.equals(Status.CANCELLED)) {
                let { cancelledPost, updatedPost } = await cancelPending(pendingId);
            }
            else {
                let { cancelledPost, updatedPost } = await finishPending(pendingId);
            }
            
            return;
        }

        const remind = async (recieverNumber, publisherNumber, groceries) => {
            console.log("TAKEN???"); //SEND TO CELLULAR/PUSH NOTIFICATION
            //sendSMSToNumber('Hey from Grosharies! Have you picked up the ${groceries}? Let us know!', recieverNumber);
            //sendSMSToNumber('Hey from Grosharies! Have you delivered the ${groceries}? Let us know!', publisherNumber);

            setTimeout(async function () { await decide() }, oneHour / 4);
            return;
        }

        setTimeout(async function () { await remind(user.phoneNumber, publisher.phoneNumber, pending.content) }, oneHour / 4);
    } catch (e) {
        console.log('Pending service error from interrestedUserReminder: ', e.message);

        throw Error('Error while Reminding User');
    }
};

const sendSMSToNumber = async (message, phoneNumber) => {
    var params = {
        Message: message,
        PhoneNumber: phoneNumber
    };

    const run = async () => {
        try {
            const data = await snsClient.send(new PublishCommand(params));
            console.log("Success sending SMS.", data);
            return data; // For unit tests.
        } catch (err) {
            console.log("Error sending SMS", err.stack);
        }
    };
    run();
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
                if (pendings[pended].status.finalStatus.equals(Status.PENDING)) {
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
    addPending,
    sendSMSToNumber,
    finishPending,
    cancelPending,
    deletePending,
    updatePending,
    evaluatePostStatus,
    setCollectorStatement
}
