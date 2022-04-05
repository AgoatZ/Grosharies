const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./tag.repository');
const router = express.Router();

getTags = async function (query, page, limit) {
    try {
        const tags = await Repository.getTags(query);
        return tags;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Paginating Tags');
    }
};

getTagById = async function (tagId) {
    try {
        const tag = await Repository.getTagById(tagId);
        return tag;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving Tag');
    }
};

addTag = async function (tagDetails) {
    try {
        const tag = await Repository.addTag(tagDetails);
        return tag;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Adding Tag');
    }
};

deleteTag = async function (tagId) {
    try {
        const deletedTag = await Repository.deleteTag(tagId);
        return deletedTag;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Deleting Tag');
    }
};

updateTag = async function (tagId, tagDetails) {
    try {
        const oldTag = await Repository.updateTag(tagId, tagDetails);
        return oldTag;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Updating Tag');
    }
};

module.exports = {
    getTags,
    getTagById,
    addTag,
    deleteTag,
    updateTag
}
