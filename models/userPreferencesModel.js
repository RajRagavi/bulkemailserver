// models/userPreferencesModel.js
const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emailFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
  emailFormat: { type: String, enum: ['html', 'text'], default: 'html' },
  notificationSettings: {
    campaignSuccess: { type: Boolean, default: true },
    campaignFailure: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
