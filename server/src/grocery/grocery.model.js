const mongoose = require('../db');
const packing = require('../enums/packing');
const scale = require('../enums/scale');
const Category = require('../category/category.model');

const grocery = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  scale: { type: String, enum: scale, required: true },
  packing: { type: String, enum: packing, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" , required: true}
});

const Grocery = mongoose.model('Grocery', grocery, 'Grocery');

module.exports = Grocery;