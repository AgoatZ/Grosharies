const mongoose = require("mongoose");
const status = require("../enums/post-status");
const Grocery = require("../grocery/grocery.model");
const reply = require("../enums/post-reply");
const mongoosePaginate = require("mongoose-paginate-v2");

const post = new mongoose.Schema({
  headline: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  address: { type: String, required: true },
  addressCoordinates: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
  },
  publishingDate: { type: Date, default: Date.now },
  pickUpDates: [
    {
      from: Date,
      until: Date,
    },
  ],
  status: { type: String, enum: status, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }], //TAG IS ALSO A MODEL, FUNCTIONS SIMILAR TO A CATEGORY
  content: [
    {
      original: { type: Grocery.schema, required: true },
      left: { type: Number, required: true },
    },
  ],
  description: String,
  images: [{ type: String, default: [] }],
  videos: [{ type: String, default: [] }],
  observers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], //USER ARRAY
  repliers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reply: { type: mongoose.Schema.Types.ObjectId, ref: "PendingPost" },
    },
  ],
});

post.plugin(mongoosePaginate);
const Post = mongoose.model("Post", post, "Post");

module.exports = Post;
