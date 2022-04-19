const express = require('express');
const { status } = require('express/lib/response');
const Grocery = require('./grocery.model');
const router = express.Router();

getGroceries = async function (query) {
    try {
        const groceries = await Grocery.find(query);
        return groceries;
    } catch (e) {
        console.log('Grocery repository error from getGroceries: ', e.message);

        throw Error('Error while Paginating Groceries');
    }
};

getGroceryById = async function (groceryId) {
    try {
        const grocery = await Grocery.findById(groceryId);
        return grocery;
    } catch (e) {
        console.log('Grocery repository error from getGroceryById: ', e.message);

        throw Error('Error while Retrieving Grocery');
    }
};

getGroceryByName = async function (groceryName) {
    try {
        const grocery = await Grocery.findOne({ name: groceryName });
        return grocery;
    } catch (e) {
        console.log('Grocery repository error from getGroceryByName: ', e.message);

        throw Error('Error while Retrieving Grocery');
    }
};

addGrocery = async function (groceryDetails) {
    try {
        const grocery = new Grocery(groceryDetails);
        return await grocery.save();
    } catch (e) {
        console.log('Grocery repository error from addGrocery: ', e.message);

        throw Error('Error while Adding Grocery');
    }
};

deleteGrocery = async function (groceryId) {
    try {
        const deletedGrocery = await Grocery.findByIdAndDelete(groceryId);
        return deletedGrocery;
    } catch (e) {
        console.log('Grocery repository error from deleteGrocery: ', e.message);

        throw Error('Error while Deleting Grocery');
    }
};

updateGrocery = async function (groceryId, groceryDetails) {
    try {
        const oldGrocery = await Grocery.findByIdAndUpdate(groceryId, groceryDetails);
        return oldGrocery;
    } catch (e) {
        console.log('Grocery repository error from updateGrocery: ', e.message);

        throw Error('Error while Updating Grocery');
    }
};

updateAmount = async function (groceryId, amount) {
    try {
        const oldGrocery = await Grocery.findByIdAndUpdate(groceryId, {amount: amount});
        return oldGrocery;
    } catch (e) {
        console.log('Grocery repository error from updateAmount: ', e.message);

        throw Error('Error while Updating Grocery');
    }
};

module.exports = {
    getGroceries,
    getGroceryById,
    getGroceryByName,
    addGrocery,
    deleteGrocery,
    updateGrocery,
    updateAmount
}
