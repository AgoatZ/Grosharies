const mongoose = require('../db');
const userType = require('../enums/userType');
const Grocery = require('../grocery/grocery.model');

const user = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  password: { type: String, required: true},
  phone: { type: String, required: true },
  accountType: { type: String, enum: userType, required: true , default: userType.USER},
  rank: { type: Number, default: 0 },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  profileImage: String,
  collectedHistory: [{ type: Grocery.schema, required: true , default: []}]
});

const User = mongoose.model('User', user, 'User');

module.exports = User;