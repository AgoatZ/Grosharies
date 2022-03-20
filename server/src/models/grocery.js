const mongoose = require('../db');
const package = require('../enums/package');

const grocery = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  scale: { type: String, required: true },
  package: { enum: package, required: true },
  category: { type: String, required: true}
});

const Grocery = mongoose.model('Grocery', grocery);

module.exports = Grocery;