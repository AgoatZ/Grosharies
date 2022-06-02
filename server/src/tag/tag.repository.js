const express = require('express');
const { status } = require('express/lib/response');
const Tag = require('./tag.model');

getTags = async function (query) {
    try {
        const tags = await Tag.find(query);
        return tags;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Paginating Tags');
    }
};

getTagById = async function (tagId) {
    try {
        const tag = await Tag.findById(tagId);
        if(tag != null) {
            return tag;
        } else throw Error("No tag with that id exists");
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Tag');
    }
};

addTag = async function (tagDetails) {
    try {
        const tag = new Tag(tagDetails);
        return await tag.save();
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Adding Tag');
    }
};

deleteTag = async function (tagId) {
    try {
        const deletedTag = await Tag.findByIdAndDelete(tagId);
        return deletedTag;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Deleting Tag');
    }
};

updateTag = async function (tagId, tagDetails) {
    try {
        const oldTag = await Tag.findByIdAndUpdate(tagId, tagDetails);
        return oldTag;
    } catch (e) {
        console.log('repository error: ' + e.message);

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
