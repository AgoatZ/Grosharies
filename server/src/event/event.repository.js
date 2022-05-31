const express = require('express');
const { status } = require('express/lib/response');
const Event = require('./event.model');
const router = express.Router();

getEvents = async function (query) {
    try {
        const event = await Event.find(query);
        return event;
    } catch (e) {
        console.log('Event repository error from getEvents: ', e.message);

        throw Error('Error while Paginating Events');
    }
};

getEventById = async function (eventId) {
    try {
        const event = await Event.findById(eventId);
        return event;
    } catch (e) {
        console.log('Event repository error from getEventById: ', e.message);

        throw Error('Error while Retrieving Event');
    }
};

getEventsByUser = async function (userId) {
    try {
        const events = await Event.find({ 'userId': userId });
        return events;
    } catch (e) {
        console.log('Event repository error from getEventsByUser: ', e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

getEventsByTag = async function (tagId) {
    try {
        const events = await Event.find({ 'tags': tagId });
        return events;
    } catch (e) {
        console.log('Event repository error from getEventsByTag: ', e.message);

        throw Error('Error while Retrieving Post: ' + e.message);
    }
};

addEvent = async function (eventDetails) {
    try {
        const event = new Event(eventDetails);
        return await event.save();
    } catch (e) {
        console.log('Event repository error from addEvent: ', e.message);

        throw Error('Error while Adding Event');
    }
};

deleteEvent = async function (eventId) {
    try {
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        return deletedEvent;
    } catch (e) {
        console.log('Event repository error from deleteEvent: ', e.message);

        throw Error('Error while Deleting Event');
    }
};

updateEvent = async function (eventId, eventDetails) {
    try {
        const oldEvent = await Event.findByIdAndUpdate(eventId, eventDetails);
        return oldEvent;
    } catch (e) {
        console.log('Event repository error from updateEvent: ', e.message);

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
