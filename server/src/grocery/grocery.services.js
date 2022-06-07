const express = require('express');
const { status } = require('express/lib/response');
const GroceryRepository = require('./grocery.repository');
const CategoryRepository = require('../category/category.repository');
const fs = require('fs');

const getGroceries = async function (query, page, limit) {
    try {
        let options;
        if (page && limit) {
            options = { page: page, limit: limit };
        } else {
            options = { pagination: false }
        }
        const groceries = await GroceryRepository.getGroceries(query, options);
        return groceries;
    } catch (e) {
        console.log('Grocery service error from getGroceries: ', e.message);

        throw Error('Error while Paginating Groceries');
    }
};

const getGroceryById = async function (groceryId) {
    try {
        const grocery = await GroceryRepository.getGroceryById(groceryId);
        return grocery;
    } catch (e) {
        console.log('Grocery service error from getGroceryById: ', e.message);

        throw Error('Error while Retrieving Grocery');
    }
};

const getGroceryByName = async function (groceryName) {
    try {
        const grocery = await GroceryRepository.getGroceryByName(groceryName);
        return grocery;
    } catch (e) {
        console.log('Grocery service error from getGroceryByName: ', e.message);

        throw Error('Error while Retrieving Grocery');
    }
};

const addGrocery = async function (groceryDetails) {
    try {
        const grocery = await GroceryRepository.addGrocery(groceryDetails);
        let category = await CategoryRepository.getCategoryById(groceryDetails.category);
        category.groceries.push(grocery);
        await CategoryRepository.updateCategory({ groceries: category.groceries });
        return grocery;
    } catch (e) {
        console.log('Grocery service error from addGrocery: ', e.message);

        throw Error('Error while Adding Grocery');
    }
};

const deleteGrocery = async function (groceryId) {
    try {
        const deletedGrocery = await GroceryRepository.deleteGrocery(groceryId);
        return deletedGrocery;
    } catch (e) {
        console.log('Grocery service error from deleteGrocery: ', e.message);

        throw Error('Error while Deleting Grocery');
    }
};

const updateGrocery = async function (groceryId, groceryDetails) {
    try {
        const oldGrocery = await GroceryRepository.updateGrocery(groceryId, groceryDetails);
        return oldGrocery;
    } catch (e) {
        console.log('Grocery service error from updateGrocery: ', e.message);

        throw Error('Error while Updating Grocery');
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
