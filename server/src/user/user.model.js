const mongoose = require('mongoose');
const userType = require('../enums/user-type');
const userSource = require('../enums/user-source');
const mongoosePaginate = require('mongoose-paginate-v2');

const user = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  accountType: { type: String, enum: userType, required: true , default: userType.USER},
  rank: { type: Number, default: 0 },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  profileImage: String,
  source: { type: String, enum: userSource, required: true, default: userSource.GROSHARIES },
  collectedHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "PendingPost"}],
  notifications: []
});
user.plugin(mongoosePaginate);
const User = mongoose.model('User', user, 'User');

module.exports = User;