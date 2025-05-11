// server/models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  employer:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:           { type: String, required: true },
  company:         { type: String, required: true },
  location:        { type: String },
  employmentType:  {
    type: String,
    enum: ['Full-Time','Part-Time','Contract','Internship'],
    default: 'Full-Time'
  },
  postedAt:        { type: Date, default: Date.now },
  deadline:        { type: Date },
  experienceLevel: {
    type: String,
    enum: ['Junior','Mid','Senior'],
    default: 'Junior'
  },
  salaryRange:     { type: String },
  skills:          [String],
  responsibilities:[String],
  qualifications:  [String],
  benefits:        [String],
  description:     { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
