const GroceryService = require('./grocery.services');  
const imageUtil = require('../common/middlewares/image-upload');

const getGroceries = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 10;
    try {
        const groceries = await GroceryService.getGroceries({}, page, limit);
        let count = 0;
        for (i in groceries) {
            count++;
        }
        console.log('amount retrieved:', count);
        return res.status(200).json({ groceries: groceries, message: "Succesfully Groceries Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getGroceryById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const grocery = await GroceryService.getGroceryById(req.params.id)
        return res.status(200).json({ grocery: grocery, message: "Succesfully Grocery Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const getGroceryByName = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const grocery = await GroceryService.getGroceryByName(req.params.name);
        return res.status(200).json({ grocery: grocery, message: "Succesfully Grocery Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const addGrocery = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const grocery = await GroceryService.addGrocery(req.body);
        return res.status(200).json({ grocery: grocery, message: "Succesfully Grocery Added" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

const deleteGrocery = async function (req, res, next) {
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

module.exports = {
    getGroceries,
    getGroceryById,
    getGroceryByName,
    addGrocery,
    deleteGrocery,
    updateGrocery
}