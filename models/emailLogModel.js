// models/emailLogModel.js
const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailCampaign', required: true },
  email: { type: String, required: true },
  status: { type: String, required: true }, // sent, failed
  message: { type: String, required: true }, // success/failure message
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
