const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./pending.repository');
const GroceryRepository = require('../grocery/grocery.repository');
const UserRepository = require('../user/user.repository');
const PostRepository = require('../post/post.repository');
const router = express.Router();
const oneHour = 60*60*60*1000;
const Status = require('../enums/pending-status');
const { PublishCommand } = require ('@aws-sdk/client-sns');
const { snsClient } = require ('../common/utils/sns-client');

const getPendings = async function (query, page, limit) {
    try {
        const posts = await Repository.getPendings(query);
        return posts;
    } catch (e) {
        console.log('Pending service error from getPendings: ', e.message);

        throw Error('Error while Retrieving Pendings');
    }
};

const getPendingById = async function (postId) {
    try {
        const post = await Repository.getPendingById(postId);
        return post;
    } catch (e) {
        console.log('Pending service error from getPendingById: ', e.message);

        throw Error('Error while Retrieving Pending');
    }
};

const getPendingsByUser = async function (userId) {
    try {
        const posts = await Repository.getPendingsByUser(userId);
        return posts;
    } catch (e) {
        console.log('Pending service error from getPendingsByUser: ', e.message);

        throw Error('Error while Retrieving Pendings by User');
    }
};

const getPendingsByCollector = async function (userId) {
    try {
        const pendingPosts = await Repository.getPendingsByCollector(userId);
        return pendingPosts;
    } catch (e) {
        console.log('Pending service error from getPendingsByCollector: ', e.message);

        throw Error('Error while Retrieving Pendings by Collector');
    }
};

const getPendingsByCategory = async function (categoryId) {
    try {
        const posts = await Repository.getPendingsByCategory(categoryId);
        return posts;
    } catch (e) {
        console.log('Pending service error from getPendingsByCategory: ', e.message);

        throw Error('Error while Retrieving Pendings by Category');
    }
};

const getPendingsByTag = async function (tagId) {
    try {
        const posts = await Repository.getPendingsByTag(tagId);
        return posts;
    } catch (e) {
        console.log('Pending service error from getPendingsByTag: ', e.message);

        throw Error('Error while Retrieving Pendings by Tag');
    }
};

const getPendingsByPost = async function (postId) {
    try {
        const posts = await Repository.getPendingsByPost(postId);
        return posts;
    } catch (e) {
        console.log('Pending service error from getPendingsByPost: ', e.message);

        throw Error('Error while Retrieving Pendings by Tag');
    }
};

const addPending = async function (postDetails) {
    try {
        const pendingPost = await Repository.addPending(postDetails);
        await interrestedUserReminder(pendingPost.collectorId, pendingPost._id);

        return pendingPost;
    } catch (e) {
        console.log('Pending service error from addPending: ', e.message);

        throw Error('Error while Adding Pendings');
    }
};

const deletePending = async function (postId) {
    try {
        const deletedPost = await Repository.deletePending(postId);
        return deletedPost;
    } catch (e) {
        console.log('Pending service error from deletePending: ', e.message);

        throw Error('Error while Deleting Pendings');
    }
};

const getAllPendingPosts = async function () {
    try {
        const pendingPosts = await Repository.getAllPendingPosts();
        return pendingPosts;
    } catch (e) {
        console.log('Pending service error from getAllPendingPosts: ', e.message);

        throw Error('Error while Retrieving Pending Posts');
    }
};

const getAllFinishedPosts = async function () {
    try {
        const finishedPosts = await Repository.getAllFinishedPosts();
        return finishedPosts;
    } catch (e) {
        console.log('Pending service error from getAllFinishedPosts: ', e.message);

        throw Error('Error while Retrieving Collected Posts');
    }
};

const getAllCancelledPosts = async function () {
    try {
        const finishedPosts = await Repository.getAllCancelledPosts();
        return finishedPosts;
    } catch (e) {
        console.log('Pending service error from getAllCancelledPosts: ', e.message);

        throw Error('Error while Retrieving Cancelled Posts');
    }
};

const updatePending = async function (postId, postDetails) {
    try {
        const oldPost = await Repository.updatePending(postId, postDetails);
        return oldPost;
    } catch (e) {
        console.log('Pending service error from updatePending: ', e.message);

        throw Error('Error while Updating Pendings');
    }
};

const finishPending = async function (pendingPostId) {
    try {
        let pendingPost = await Repository.getPendingById(pendingPostId);
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
        await Repository.updatePendingStatus(pendingPostId, Status.COLLECTED);

        const finishedPost = await Repository.getPendingById(pendingPostId);

        if (isPostDone(pendingPost.sourcePost)) {
            PostRepository.updatePost({ status: 'still there'})
        }
        return {finishedPost, trafficGroceries};
    } catch (e) {
        console.log('Pending service error from finishPending: ', e.message);

        throw Error('Error while Finnishing Pending');
    }
};

const cancelPending = async function (pendingPostId) {
    console.log("ENTERRED CANCEL PENDING FIRST");
    try {
        console.log("cacncelling ID: ", pendingPostId);
        let pendingPost = await Repository.getPendingById(pendingPostId);
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

        await Repository.updatePendingStatus(pendingPostId, Status.CANCELLED);

        const cancelledPost = await Repository.getPendingById(pendingPostId);

        return {cancelledPost, updatedPost};
    } catch (e) {
        console.log('Pending service error from cancelPending: ', e.message);

        throw Error('Error while Cancelling Pending');
    }
};

const interrestedUserReminder = async (userId, postId) => {
    try {
        const user = await UserRepository.getUserById(userId);
        const post = await Repository.getPendingById(postId);
        const publisher = await UserRepository.getUserById(post.publisherId);
        console.log("ENTERRED REMINDER");
        
        const decide = async function () {
            console.log("ENTERRED DECIDE with id: ", postId);
            if(post.status === Status.PENDING) {
                console.log("status from interrestedUserReminder: ", post.status);
                console.log("WILL CALL NOW CANCEL PENDING POST");
                let {cancelledPost, updatedPost} = await cancelPending(postId);
            }
            return;
        }

        const remind = async (recieverNumber, publisherNumber, groceries) => {
            console.log("TAKEN???"); //SEND TO CELLULAR/PUSH NOTIFICATION
            //sendSMSToNumber('Hey from Grosharies! Have you picked up the ${groceries}? Let us know!', recieverNumber);
            //sendSMSToNumber('Hey from Grosharies! Have you delivered the ${groceries}? Let us know!', publisherNumber);

            setTimeout(async function() {await decide()}, oneHour/4);
            return;
        }

        setTimeout(async function() {await remind(user.phoneNumber, publisher.phoneNumber, post.content)}, oneHour/4);
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
        console.log("Success.",  data);
        return data; // For unit tests.
        } catch (err) {
        console.log("Error", err.stack);
        }
    };
    run();
};

const evaluatePostStatus = async (postId) => {
    const post = await PostRepository.getPostById(postId);
    const pendings = await getPendingsByPost(postId);

    for (grocery in post.content) {
        if (post.content[grocery].amount != 0) {
            return false;
        }
    }

    for (pended in pendings) {
        if (pendings[pended].status == PendingStatus.PENDING) {
            return false;
        }
    }

    return true;
};

module.exports = {
    getPendings,
    getPendingById,
    getPendingsByUser,
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
    evaluatePostStatus
}
