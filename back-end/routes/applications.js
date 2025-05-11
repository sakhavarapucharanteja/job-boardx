// server/routes/applications.js
const express  = require('express');
const multer   = require('multer');
const auth     = require('../middleware/auth');
const roles    = require('../middleware/roles');
const {
  applyJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus
} = require('../controllers/applicationsController');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// 1) Job Seeker applies (upload resume)
router.post(
  '/',
  auth,
  roles('job_seeker'),
  upload.single('resume'),
  applyJob
);

// 2) Job Seeker: list own applications
router.get(
  '/me',
  auth,
  roles('job_seeker'),
  getMyApplications
);

// 3) Employer: list applicants for a given job
router.get(
  '/job/:jobId',
  auth,
  roles('employer'),
  getApplicantsForJob
);

// 4) Employer: update application status
router.put(
  '/:id/status',
  auth,
  roles('employer'),
  updateApplicationStatus
);

module.exports = router;
