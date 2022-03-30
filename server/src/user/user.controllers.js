const UserService = require('./user.services');  

getUsers = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
    try {
        const users = await UserService.getUsers({}, page, limit)
        return res.status(200).json({ status: 200, data: users, message: "Succesfully Users Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ status: 400, message: e.message });
    }
};


getUserById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const user = await UserService.getUserById(req.params.id)
        return res.status(200).json({ status: 200, data: user, message: "Succesfully user Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ status: 400, message: e.message });
    }
};

addUser = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const user = await UserService.addUser(req.body);
        return res.status(200).json({ status: 200, data: user, message: "Succesfully User Added" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ status: 400, message: e.message });
    }
};

deleteUser = async function (req, res, next) {
    try {
        const user = await UserService.deleteUser(req.params.id);
        return res.status(200).json({ status: 200, data: user, message: "Succesfully User Deleted" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ status: 400, message: e.message });
    }
}

updateUser = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const oldUser = await UserService.updateUser(req.params.id, req.body);
        return res.status(200).json({ status: 200, data: oldUser, message: "Succesfully User Updated" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ status: 400, message: e.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    addUser,
    deleteUser,
    updateUser
}