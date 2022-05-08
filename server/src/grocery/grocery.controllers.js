const GroceryService = require('./grocery.services');  
const imageUtil = require('../common/middlewares/image-upload');

getGroceries = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 10;
    try {
        const groceries = await GroceryService.getGroceries({}, page, limit)
        return res.status(200).json({ groceries: groceries, message: "Succesfully Groceries Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getGroceryById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const grocery = await GroceryService.getGroceryById(req.params.id)
        return res.status(200).json({ grocery: grocery, message: "Succesfully Grocery Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getGroceryByName = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const grocery = await GroceryService.getGroceryByName(req.params.name);
        return res.status(200).json({ grocery: grocery, message: "Succesfully Grocery Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

addGrocery = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const grocery = await GroceryService.addGrocery(req.body);
        return res.status(200).json({ grocery: grocery, message: "Succesfully Grocery Added" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

deleteGrocery = async function (req, res, next) {
    try {
        const grocery = await GroceryService.deleteGrocery(req.params.id);
        return res.status(200).json({ grocery: grocery, message: "Succesfully grocery Deleted" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
}

const updateGrocery = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const oldGrocery = await GroceryService.updateGrocery(req.params.id, req.body);
        return res.status(200).json({ oldGrocery: oldGrocery, message: "Succesfully Grocery Updated" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const uploadImage = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const answer = await GroceryService.uploadImage(req, res);
        return answer;
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

module.exports = {
    getGroceries,
    getGroceryById,
    getGroceryByName,
    addGrocery,
    deleteGrocery,
    updateGrocery,
    uploadImage
}