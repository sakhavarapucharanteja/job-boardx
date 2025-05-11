// server/controllers/jobsController.js
const Job = require('../models/Job');

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('employer', ['name'])
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// New: fetch a single job by ID with all fields
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', ['name', 'email']); // add fields as desired
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.createJob = async (req, res) => {
  try {
    // req.body should include all new fields (description, skills, etc.)
    const job = new Job({ employer: req.user.id, ...req.body });
    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }
    job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }
    await job.remove();
    res.json({ msg: 'Job removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// existing imports…
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job
      .find({ employer: req.user.id })
      .populate('employer', ['name', 'email'])
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
