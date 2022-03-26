const mongoose = require('../db');

const category = new mongoose.Schema({
  name: { type: String, required: true },
  groceries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Grocery" }]
});

const Category = mongoose.model('Category', category);

module.exports = Category;