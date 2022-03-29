const express = require('express');
const { status } = require('express/lib/response');
const Category = require('./category.model');
const router = express.Router();

getCategories = async function (query, page, limit) {
    try {
        var categories = await Category.find(query)
        return categories;
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Categories')
    }
};

getCategoryById = async function (categoryId) {
    try {
        var category = await Category.findById(categoryId)
        return category;
    } catch (e) {
        // Log Errors
        throw Error('Error while Retrieving Category')
    }
};

addCategory = async function (categoryDetails) {
    try {
        var category = new Category(categoryDetails);
        return category.save();
    } catch (e) {
        // Log Errors
        throw Error('Error while Adding Category')
    }
};

deleteCategory = async function (categpryId) {
    try {
        var deletedCategory = Category.findByIdAndDelete(categpryId);
        return deletedCategory;
    } catch (e) {
        // Log Errors
        throw Error('Error while Deleting Category');
    }
};

updateCategory = async function (categoryId, categoryDetails) {
    try {
        var oldCategory = Category.findByIdAndUpdate(categoryId, categoryDetails);
        return oldCategory;
    } catch (e) {
        // Log Errors
        throw Error('Error while Updating Category')
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    addCategory,
    deleteCategory,
    updateCategory
}
