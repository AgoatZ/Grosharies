const mongoose = require('mongoose');
const Post = require('../post/post.model');

const pending = new mongoose.Schema({
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isPending: { type: Boolean, required: true, default: true },
  pendingTime: { 
    from: { type: Date, default: Date.now },
    until: { type: Date, required: true }
  }
});

const Pending = Post.discriminator('PendingPost', pending);

module.exports = Pending;