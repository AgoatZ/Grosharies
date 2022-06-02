const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./category.repository');

getCategories = async function (query, page, limit) {
    try {
        const categories = await Repository.getCategories(query);
        return categories;
    } catch (e) {
        console.log('Category service error from getCategories: ', e.message);

        throw Error('Error while Paginating Categories');
    }
};

getCategoryById = async function (categoryId) {
    try {
        const category = await Repository.getCategoryById(categoryId);
        return category;
    } catch (e) {
        console.log('Category service error from getCategoryById: ', e.message);

        throw Error('Error while Retrieving Category');
    }
};

addCategory = async function (categoryDetails) {
    try {
        const category = await Repository.addCategory(categoryDetails);
        return category;
    } catch (e) {
        console.log('Category service error from addCategory: ', e.message);

        throw Error('Error while Adding Category');
    }
};

deleteCategory = async function (categpryId) {
    try {
        const deletedCategory = await Repository.deleteCategory(categpryId);
        return deletedCategory;
    } catch (e) {
        console.log('Category service error from deleteCategory: ', e.message);

        throw Error('Error while Deleting Category');
    }
};

updateCategory = async function (categoryId, categoryDetails) {
    try {
        const oldCategory = await Repository.updateCategory(categoryId, categoryDetails);
        return oldCategory;
    } catch (e) {
        console.log('Category service error from updateCategory: ', e.message);

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
