const express = require('express');
const { status } = require('express/lib/response');
const Grocery = require('./grocery.model');

const getGroceries = async function (query, options) {
    try {
        const groceries = await Grocery.paginate(query, options);
        return groceries.docs;
    } catch (e) {
        console.log('Grocery repository error from getGroceries: ', e.message);

        throw Error('Error while Paginating Groceries');
    }
};

const getGroceryById = async function (groceryId) {
    try {
        const grocery = await Grocery.findById(groceryId);
        return grocery;
    } catch (e) {
        console.log('Grocery repository error from getGroceryById: ', e.message);

        throw Error('Error while Retrieving Grocery');
    }
};

const getGroceryByName = async function (groceryName) {
    try {
        const grocery = await Grocery.findOne({ name: groceryName });
        return grocery;
    } catch (e) {
        console.log('Grocery repository error from getGroceryByName: ', e.message);

        throw Error('Error while Retrieving Grocery');
    }
};

const addGrocery = async function (groceryDetails) {
    try {
        const grocery = new Grocery(groceryDetails);
        return await grocery.save();
    } catch (e) {
        console.log('Grocery repository error from addGrocery: ', e.message);

        throw Error('Error while Adding Grocery');
    }
};

const deleteGrocery = async function (groceryId) {
    try {
        const deletedGrocery = await Grocery.findByIdAndDelete(groceryId);
        return deletedGrocery;
    } catch (e) {
        console.log('Grocery repository error from deleteGrocery: ', e.message);

        throw Error('Error while Deleting Grocery');
    }
};

const updateGrocery = async function (groceryId, groceryDetails) {
    try {
        const oldGrocery = await Grocery.findByIdAndUpdate(groceryId, groceryDetails);
        return oldGrocery;
    } catch (e) {
        console.log('Grocery repository error from updateGrocery: ', e.message);

        throw Error('Error while Updating Grocery');
    }
};

const updateAmount = async function (groceryId, amount) {
    try {
        const oldGrocery = await Grocery.findByIdAndUpdate(groceryId, {amount: amount});
        return oldGrocery;
    } catch (e) {
        console.log('Grocery repository error from updateAmount: ', e.message);

        throw Error('Error while Updating Grocery');
    }
};

const searchGrocery = async (searchValue, options) => {
    const filteredGroceries = await Grocery.paginate({
        name: { $regex: searchValue, $options: i }
    }, options);
    return filteredGroceries.docs;
};

module.exports = {
    getGroceries,
    getGroceryById,
    getGroceryByName,
    addGrocery,
    deleteGrocery,
    updateGrocery,
    updateAmount,
    searchGrocery
};