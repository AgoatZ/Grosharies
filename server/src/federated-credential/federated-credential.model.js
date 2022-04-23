const mongoose = require('mongoose');

const federatedCredential = new mongoose.Schema({
  userId: { type: Number, required: true },
  provider: { type: String, required: true, index: true},
  subject: { type: String, required: true, index: true}
});

const FederatedCredential = mongoose.model('FederatedCredential', federatedCredential, 'FederatedCredential');

module.exports = FederatedCredential;