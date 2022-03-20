const mongoose = require('../db');
const status = require('../enums/postStatus');

const post = new mongoose.Schema({
  headline: { type: String, required: true },
  userId: { type: String, required: true },
  address: { type: String, required: true },
  publishingDate: { type: Date, default: Date.now },
  pickUpDates: [{
    from: Date,
    until: Date
}],
  status: { enum: status, required: true },
  tags: [String],
  content: [{ type: Grocery, required: true }],
  description: String,
  images: [String],
  videos: [String],
  observers: [String],
  repliers: [{
    userId: String,
    reply: String
}]
});

const Post = mongoose.model('Post', post);

module.exports = Post;