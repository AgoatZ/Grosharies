const mongoose = require('../db');
const userType = require("../enums/userType");

const user = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  phone: { type: String, required: true },
  accountType: { type: String, enum: userType, required: true , default: userType.USER},
  rank: { type: Number, default: 0 },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  profileImage: String,
  collectedHistory: [String]
});

const User = mongoose.model('User', user);

module.exports = User;