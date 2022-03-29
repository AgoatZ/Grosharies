const express = require('express');
const { status } = require('express/lib/response');
const Event = require('./event.model');
const router = express.Router();

getEvents = async function (query, page, limit) {
    try {
        var event = await Event.find(query)
        return event;
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Events')
    }
};

getEventById = async function (eventId) {
    try {
        var event = await Event.findById(eventId)
        return event;
    } catch (e) {
        // Log Errors
        throw Error('Error while Retrieving Event')
    }
};

addEvent = async function (eventDetails) {
    try {
        var event = new Event(eventDetails);
        return event.save();
    } catch (e) {
        // Log Errors
        throw Error('Error while Adding Event')
    }
};

deleteEvent = async function (eventId) {
    try {
        var deletedEvent = Event.findByIdAndDelete(eventId);
        return deletedEvent;
    } catch (e) {
        // Log Errors
        throw Error('Error while Deleting Event');
    }
};

updateEvent = async function (eventId, eventDetails) {
    try {
        var oldEvent = Event.findByIdAndUpdate(eventId, eventDetails);
        return oldEvent;
    } catch (e) {
        // Log Errors
        throw Error('Error while Updating Event')
    }
};

module.exports = {
    getEvents,
    getEventById,
    addEvent,
    deleteEvent,
    updateEvent
}
