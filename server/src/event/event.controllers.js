var EventService = require('./event.services');  

getEvents = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    
    var page = req.params.page ? req.params.page : 1;
    var limit = req.params.limit ? req.params.limit : 10;
    try {
        var events = await EventService.getEvents({}, page, limit)
        return res.status(200).json({ events: events, message: "Succesfully Events Retrieved" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

getEventById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        var event = await EventService.getEventById(req.params.id)
        return res.status(200).json({ event: event, message: "Succesfully Event Retrieved" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

getEventsByUser = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const events = await EventService.getEventsByUser(req.params.id);
        return res.status(200).json({ events: events, message: "Succesfully Events Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

getEventsByTag = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const events = await EventService.getEventsByTag(req.params.id);
        return res.status(200).json({ events: events, message: "Succesfully Events Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};


addEvent = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        var event = await EventService.addEvent(req.body);
        return res.status(200).json({ event: event, message: "Succesfully Event Added" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

deleteEvent = async function (req, res, next) {
    try {
        var event = await EventService.deleteEvent(req.params.id);
        return res.status(200).json({ event: event, message: "Succesfully Events Deleted" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
}

updateEvent = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        var oldEvent = await EventService.updateEvent(req.params.id, req.body);
        return res.status(200).json({ oldEvent: oldEvent, message: "Succesfully Event Updated" });
    } catch (e) {
        return res.status(400).json({ message: e.message });
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