const mongoose = require('mongoose');
const status = require('../enums/event-status');

const event = new mongoose.Schema({
  headline: { type: String, required: true },
  userId: { type: String, required: true },
  address: { type: String, required: true },
  publishingDate: { type: Date, default: Date.now },
  happeningDates: [{
    from: Date,
    until: Date
}],
  status: { type: String, enum: status, required: true },
  tags: [String],
  description: String,
  images: [{ type: String, default: [] }],
  videos: [{ type: String, default: [] }],
  observers: [String],
  repliers: [{
    userId: String,
    reply: String
}]
});

const Event = mongoose.model('Event', event, 'Event');

module.exports = Event;