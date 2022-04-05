const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./grocery.repository');
const router = express.Router();

getGroceries = async function (query, page, limit) {
    try {
        const groceries = await Repository.getGroceries(query);
        return groceries;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Paginating Groceries');
    }
};

getGroceryById = async function (groceryId) {
    try {
        const grocery = await Repository.getGroceryById(groceryId);
        return grocery;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Grocery');
    }
};

addGrocery = async function (groceryDetails) {
    try {
        const grocery = await Repository.addGrocery(groceryDetails);
        return grocery;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Adding Grocery');
    }
};

deleteGrocery = async function (groceryId) {
    try {
        const deletedGrocery = await Repository.deleteGrocery(groceryId);
        return deletedGrocery;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Deleting Grocery');
    }
};

updateGrocery = async function (groceryId, groceryDetails) {
    try {
        const oldGrocery = await Repository.updateGrocery(groceryId, groceryDetails);
        return oldGrocery;
    } catch (e) {
        console.log('service error: ' + e.message);

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
