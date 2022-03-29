const express = require('express');
const { status } = require('express/lib/response');
const Tag = require('./tag.model');
const router = express.Router();

getTags = async function (query, page, limit) {
    try {
        var tags = await Tag.find(query)
        return tags;
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Tags')
    }
};

getTagById = async function (tagId) {
    try {
        var tag = await Tag.findById(tagId)
        return tag;
    } catch (e) {
        // Log Errors
        throw Error('Error while Retrieving Tag')
    }
};

addTag = async function (tagDetails) {
    try {
        var tag = new Tag(tagDetails);
        return tag.save();
    } catch (e) {
        // Log Errors
        throw Error('Error while Adding Tag')
    }
};

deleteTag = async function (tagId) {
    try {
        var deletedTag = Tag.findByIdAndDelete(tagId);
        return deletedTag;
    } catch (e) {
        // Log Errors
        throw Error('Error while Deleting Tag');
    }
};

updateTag = async function (tagId, tagDetails) {
    try {
        var oldTag = Tag.findByIdAndUpdate(tagId, tagDetails);
        return oldTag;
    } catch (e) {
        // Log Errors
        throw Error('Error while Updating Tag')
    }
};

module.exports = {
    getTags,
    getTagById,
    addTag,
    deleteTag,
    updateTag
}
