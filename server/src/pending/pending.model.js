const mongoose = require('mongoose');
const Grocery = require('../grocery/grocery.model');
const status = require('../enums/pending-status');
const mongoosePaginate = require('mongoose-paginate-v2');

const pending = new mongoose.Schema({
  headline: { type: String, required: true },
  address: { type: String, required: true },
  addressCoordinates: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false }
  },
  content: [{ type: Grocery.schema, required: true, default: [] }],
  sourcePost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { 
    publisherStatement: { type: String, enum: status, required: true, default: status.PENDING },
    collectorStatement: { type: String, enum: status, required: true, default: status.PENDING },
    finalStatus: { type: String, enum: status, required: true, default: status.PENDING }
  },
  pendingTime: { 
    from: { type: Date },
    until: { type: Date }
  }
});

pending.plugin(mongoosePaginate);
const Pending = mongoose.model('PendingPost', pending, 'PendingPost');

module.exports = Pending;