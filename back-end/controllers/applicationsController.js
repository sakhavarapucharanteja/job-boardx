// server/controllers/applicationsController.js
const Application = require('../models/Application');

/**
 * Job Seeker: apply for a job
 * Expects `req.file` (resume upload) and fields in `req.body`
 */
exports.applyJob = async (req, res) => {
  try {
    const { job, fullName, email, phone, coverLetter } = req.body;
    if (!req.file) {
      return res.status(400).json({ msg: 'Resume file is required' });
    }

    const app = new Application({
      job,
      applicant:   req.user.id,
      fullName,
      email,
      phone,
      coverLetter,
      resume: {
        filename:     req.file.filename,
        originalName: req.file.originalname,
        mimeType:     req.file.mimetype,
        path:         req.file.path
      }
    });
    await app.save();
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Job Seeker: list their own applications
 */
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application
      .find({ applicant: req.user.id })
      .populate('job', ['title','company','postedAt'])
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Employer: list all applicants for a given job
 */
exports.getApplicantsForJob = async (req, res) => {
  try {
    const apps = await Application
      .find({ job: req.params.jobId })
      .populate('applicant', ['name','email'])
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Employer: update an application’s status
 */
exports.updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  if (!['pending','accepted','rejected'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }
  try {
    const app = await Application.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ msg: 'Application not found' });
    }
    app.status = status;
    await app.save();
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
