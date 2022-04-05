const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./event.repository');
const router = express.Router();

getEvents = async function (query, page, limit) {
    try {
        const event = await Repository.getEvents(query);
        return event;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Paginating Events');
    }
};

getEventById = async function (eventId) {
    try {
        const event = await Repository.getEventById(eventId);
        return event;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving Event');
    }
};

getEventsByUser = async function (userId) {
    try {
        const events = await Repository.getEventsByUser(userId);
        return events;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

getEventsByTag = async function (tagId) {
    try {
        const events = await Repository.getEventsByTag(tagId);
        return events;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

addEvent = async function (eventDetails) {
    try {
        const event = await Repository.addEvent(eventDetails);
        return event;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Adding Event');
    }
};

deleteEvent = async function (eventId) {
    try {
        const deletedEvent = await Repository.deleteEvent(eventId);
        return deletedEvent;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Deleting Event');
    }
};

updateEvent = async function (eventId, eventDetails) {
    try {
        const oldEvent = await Repository.updateEvent(eventId, eventDetails);
        return oldEvent;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Updating Event');
    }
};

module.exports = {
    getEvents,
    getEventById,
    getEventsByUser,
    getEventsByTag,
    addEvent,
    deleteEvent,
    updateEvent
}
