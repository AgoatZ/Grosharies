const express = require('express');
const { status } = require('express/lib/response');
const Grocery = require('./grocery.model');
const router = express.Router();

getGroceries = async function (query, page, limit) {
    try {
        var groceries = await Grocery.find(query)
        return groceries;
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Groceries')
    }
};

getGroceryById = async function (groceryId) {
    try {
        var grocery = await Grocery.findById(groceryId)
        return grocery;
    } catch (e) {
        // Log Errors
        throw Error('Error while Retrieving Grocery')
    }
};

addGrocery = async function (groceryDetails) {
    try {
        var grocery = new Grocery(groceryDetails);
        return grocery.save();
    } catch (e) {
        // Log Errors
        throw Error('Error while Adding Grocery')
    }
};

deleteGrocery = async function (groceryId) {
    try {
        var deletedGrocery = Grocery.findByIdAndDelete(groceryId);
        return deletedGrocery;
    } catch (e) {
        // Log Errors
        throw Error('Error while Deleting Grocery');
    }
};

updateGrocery = async function (groceryId, groceryDetails) {
    try {
        var oldGrocery = Grocery.findByIdAndUpdate(groceryId, groceryDetails);
        return oldGrocery;
    } catch (e) {
        // Log Errors
        throw Error('Error while Updating Grocery')
    }
};

module.exports = {
    getGroceries,
    getGroceryById,
    addGrocery,
    deleteGrocery,
    updateGrocery
}
