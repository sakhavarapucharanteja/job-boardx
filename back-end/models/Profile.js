const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio:        { type: String, default: '' },
  skills:     { type: [String], default: [] },
  resume:     { type: String, default: '' },  // URL to resume
  experience: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
