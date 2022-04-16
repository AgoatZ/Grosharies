const mongoose = require('mongoose');
const Grocery = require('../grocery/grocery.model');
const status = require('../enums/pendingStatus');

const pending = new mongoose.Schema({
  headline: { type: String, required: true },
  address: { type: String, required: true },
  content: [{ type: Grocery.schema, required: true , default: []}],
  sourcePost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: status, required: true, default: status.PENDING },
  pendingTime: { 
    from: { type: Date },
    until: { type: Date }
  }
});

const Pending = mongoose.model('PendingPost', pending, 'PendingPost');

module.exports = Pending;