// server/routes/jobs.js
const express = require('express');
const auth    = require('../middleware/auth');
const roles   = require('../middleware/roles');
const {
  getJobs,
  getMyJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobsController');

const router = express.Router();

// Public: list all jobs
router.get('/', getJobs);

// Employer-only: list just this employer’s own jobs
// Must come before the '/:id' route so "my" isn't treated as an ObjectId
router.get(
  '/my',
  auth,
  roles('employer'),
  getMyJobs
);

// Public: get a single job by ID
router.get('/:id', getJob);

// Employer-only: create, update, delete jobs
router.post(
  '/',
  auth,
  roles('employer'),
  createJob
);

router.put(
  '/:id',
  auth,
  roles('employer'),
  updateJob
);

router.delete(
  '/:id',
  auth,
  roles('employer'),
  deleteJob
);

module.exports = router;
