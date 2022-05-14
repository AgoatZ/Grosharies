const PendingService = require('./pending.services');

getPendings = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
    try {
        const posts = await PendingService.getPendings({}, page, limit);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getPendings: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getPendingById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const post = await PendingService.getPendingById(req.params.id);
        return res.status(200).json({ post: post, message: "Succesfully Post Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getPendingById: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getPendingsByUser = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const posts = await PendingService.getPendingsByUser(req.user._id);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getPendingsByUser: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getPendingsByCategory = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const posts = await PendingService.getPendingsByCategory(req.params.id);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getPendingsByCategory: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getPendingsByTag = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const posts = await PendingService.getPendingsByTag(req.params.id);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getPendingsByTag: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getPendingsByCollector = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const posts = await PendingService.getPendingsByCollector(req.params.id);
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getPendingsByCollector: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getAllPendingPosts = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const posts = await PendingService.getAllPendingPosts();
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getAllPendingPosts: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getAllFinishedPosts = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const posts = await PendingService.getAllFinishedPosts();
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getAllFinishedPosts: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getAllCancelledPosts = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const posts = await PendingService.getAllCancelledPosts();
        return res.status(200).json({ posts: posts, message: "Succesfully Posts Retrieved" });
    } catch (e) {
        console.log('Pending controller error from getAllCancelledPosts: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

addPending = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const post = await PendingService.addPending(req.body);
        return res.status(200).json({ post: post, message: "Succesfully Pending Added" });
    } catch (e) {
        console.log('Pending controller error from addPending: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

deletePending = async function (req, res, next) {
    try {
        const post = await PendingService.deletePending(req.params.id);
        return res.status(200).json({ post: post, message: "Succesfully Posts Deleted" });
    } catch (e) {
        console.log('Pending controller error from deletePending: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
}

updatePending = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const oldPost = await PendingService.updatePending(req.params.id, req.body);
        return res.status(200).json({ oldPost: oldPost, message: "Succesfully Post Updated" });
    } catch (e) {
        console.log('Pending controller error from updatePending: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

finishPending = async function (req, res, next) {
    try {
        console.log('Enterred finishPending Controller');
        const { finishedPending, trafficGroceries } = await PendingService.finishPending(req.params.id);
        return res.status(200).json({ post: finishedPending, groceries: trafficGroceries, message: "Succesfully Pending Post Finished" });
    } catch (e) {
        console.log('Pending controller error from finishPending: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

cancelPending = async function (req, res, next) {
    try {
        const { cancelledPost, updatedPost } = await PendingService.cancelPending(req.params.id);
        return res.status(200).json({ cancelledPost: cancelledPost, updatedPost: updatedPost, message: "Succesfully Pending Post Cancelled" });
    } catch (e) {
        console.log('Pending controller error from cancelPending: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

module.exports = {
    getPendings,
    getPendingById,
    getPendingsByUser,
    getPendingsByCategory,
    getPendingsByTag,
    getPendingsByCollector,
    getAllFinishedPosts,
    getAllPendingPosts,
    getAllCancelledPosts,
    addPending,
    finishPending,
    cancelPending,
    deletePending,
    updatePending
}