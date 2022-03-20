const mongoose = require('../db');
const status = require('../enums/eventStatus');

const event = new mongoose.Schema({
  headline: { type: String, required: true },
  userId: { type: String, required: true },
  address: { type: String, required: true },
  publishingDate: { type: Date, default: Date.now },
  happeningDates: [{
    from: Date,
    until: Date
}],
  status: { enum: status, required: true },
  tags: [String],
  description: String,
  images: [String],
  videos: [String],
  observers: [String],
  repliers: [{
    userId: String,
    reply: String
}]
});

const Event = mongoose.model('Event', event);

module.exports = Event;