const mongoose = require('../db');
const userType = require("../enums/userType");

const user = new mongoose.Schema({
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true }
},
  emailAddress: { type: String, required: true },
  phone: { type: String, required: true },
  accountType: { enum: userType, required: true },
  rank: { type: Number, default: 0 },
  posts: [String],
  profileImage: String,
  collectedHistory: [String]
});

const User = mongoose.model('User', user);

module.exports = User;
