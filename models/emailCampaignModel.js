// models/emailCampaignModel.js
const mongoose = require('mongoose');

const emailCampaignSchema = new mongoose.Schema({
  sender: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  recipients: [{
    email: { type: String, required: true },
    status: { type: String, default: 'pending' },  // pending, sent, failed
  }],
  status: { type: String, default: 'draft' }, // draft, sent, failed
  createdAt: { type: Date, default: Date.now },
  sentAt: { type: Date },
});

module.exports = mongoose.model('EmailCampaign', emailCampaignSchema);
