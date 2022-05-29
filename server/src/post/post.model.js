const mongoose = require('mongoose');
const status = require('../enums/post-status');
const Grocery = require('../grocery/grocery.model');
const reply = require('../enums/post-reply');

const post = new mongoose.Schema({
  headline: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  address: { type: String, required: true },
  addressCoordinates: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  },
  publishingDate: { type: Date, default: Date.now },
  pickUpDates: [{
    from: Date,
    until: Date
  }],
  status: { type: String, enum: status, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }], //TAG IS ALSO A MODEL, FUNCTIONS SIMILAR TO A CATEGORY
  content: [{
    original: { type: Grocery.schema, required: true },
    left: { type: Number, required: true }
  }],
  description: String,
  images: [{ type: String, default: [] }],
  videos: [{ type: String, default: [] }],
  observers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], //USER ARRAY
  repliers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reply: { type: String, enum: reply, required: false }
  }]
});

const Post = mongoose.model('Post', post, 'Post');

module.exports = Post;