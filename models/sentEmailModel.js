// models/sentEmailModel.js
const mongoose = require('mongoose');

const sentEmailSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailCampaign', required: true },
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, default: 'pending' }, // pending, sent, failed
  sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SentEmail', sentEmailSchema);
