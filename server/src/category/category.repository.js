const express = require('express');
const { status } = require('express/lib/response');
const Category = require('./category.model');
const router = express.Router();

getCategories = async function (query) {
    try {
        const categories = await Category.find(query);
        return categories;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Paginating Categories');
    }
};

getCategoryById = async function (categoryId) {
    try {
        const category = await Category.findById(categoryId);
        return category;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Category');
    }
};

addCategory = async function (categoryDetails) {
    try {
        const category = new Category(categoryDetails);
        return await category.save();
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Adding Category');
    }
};

deleteCategory = async function (categpryId) {
    try {
        const deletedCategory = await Category.findByIdAndDelete(categpryId);
        return deletedCategory;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Deleting Category');
    }
};

updateCategory = async function (categoryId, categoryDetails) {
    try {
        const oldCategory = await Category.findByIdAndUpdate(categoryId, categoryDetails);
        return oldCategory;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Updating Category');
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    addCategory,
    deleteCategory,
    updateCategory
}
