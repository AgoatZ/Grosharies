const mongoose = require('../db');
const package = require('../enums/package');
const scale = require('../enums/scale');
const Category = require('../category/category.model');

const grocery = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  scale: { type: String, enum: scale, required: true },
  package: { type: String, enum: package, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" , required: true}
});

const Grocery = mongoose.model('Grocery', grocery);

module.exports = Grocery;