const express = require('express');
const { status } = require('express/lib/response');
const Grocery = require('./grocery.model');
const router = express.Router();

getGroceries = async function (query) {
    try {
        var groceries = await Grocery.find(query);
        return groceries;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Paginating Groceries');
    }
};

getGroceryById = async function (groceryId) {
    try {
        var grocery = await Grocery.findById(groceryId);
        return grocery;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Grocery');
    }
};

addGrocery = async function (groceryDetails) {
    try {
        var grocery = new Grocery(groceryDetails);
        return await grocery.save();
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Adding Grocery');
    }
};

deleteGrocery = async function (groceryId) {
    try {
        var deletedGrocery = await Grocery.findByIdAndDelete(groceryId);
        return deletedGrocery;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Deleting Grocery');
    }
};

updateGrocery = async function (groceryId, groceryDetails) {
    try {
        var oldGrocery = await Grocery.findByIdAndUpdate(groceryId, groceryDetails);
        return oldGrocery;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Updating Grocery');
    }
};

module.exports = {
    getGroceries,
    getGroceryById,
    addGrocery,
    deleteGrocery,
    updateGrocery
}
