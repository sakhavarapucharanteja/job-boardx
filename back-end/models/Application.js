// server/models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job:        { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName:   { type: String, required: true },
  email:      { type: String, required: true },
  phone:      { type: String },
  coverLetter:{ type: String },
  resume: {
    filename:     String,
    originalName: String,
    mimeType:     String,
    path:         String
  },
  status:     { type: String, enum: ['pending','accepted','rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
