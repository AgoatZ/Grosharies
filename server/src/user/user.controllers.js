const UserService = require('./user.services');
const PostService = require('../post/post.services');

const getUsers = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
    try {
        const users = await UserService.getUsers({}, page, limit)
        return res.status(200).json({ users: users, message: "Succesfully Users Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};


const getUserById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const user = await UserService.getUserById(req.params.id)
        return res.status(200).json({ user: user, message: "Succesfully user Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const addUser = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const user = await UserService.addUser(req.body);
        return res.status(200).json({ user: user, message: "Succesfully User Added" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const deleteUser = async function (req, res, next) {
    try {
        const user = await UserService.deleteUser(req.params.id);
        return res.status(200).json({ user: user, message: "Succesfully User Deleted" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
}

const updateUser = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const oldUser = await UserService.updateUser(req.params.id, req.body);
        return res.status(200).json({ oldUser: oldUser, message: "Succesfully User Updated" });
    } catch (e) {
        console.log('controller error from updateUser: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getPickupHistory = async (req, res, next) => {
    try{
        const history = await UserService.getPickupHistory(req.params.id);
        return res.status(200).json({ history: history, message: "Succesfully History Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getSuggestedPosts = async (req, res, next) => {
    try{
        const posts = await PostService.getSuggestedPosts(req.params.id);
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getUserProfile = async (req, res, next) => {
    try{
        
        const user = await UserService.getUserById(req.params.id, req.user);
        const history = await UserService.getPickupHistory(req.params.id, req.user);
        const posts = await PostService.getPostsByUser(req.params.id, req.user);
        return res.status(200).json({ user: user, history: history, posts: posts, message: "Succesfully History Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

//TODO: Post Done

module.exports = {
    getUsers,
    getUserById,
    addUser,
    deleteUser,
    updateUser,
    getPickupHistory,
    getSuggestedPosts,
    getUserProfile
}