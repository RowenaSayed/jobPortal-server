const express = require('express');
const router = express.Router();
const { createJob, updateJob, deleteJob, getAllJobs, getAllEmployerJobs, getMyJobsApplications,getJobDetails } = require('../controllers/jobsControllers');
const { authMiddleware, authorize } = require('../middleware/auth');
router.post('/', authMiddleware, authorize(['Employer']), createJob);
router.patch('/:id', authMiddleware, authorize(['Employer']), updateJob);
router.delete('/:id', authMiddleware, authorize(['Employer', 'Admin']), deleteJob);
router.get('/my-jobs', authMiddleware, authorize(['Employer']), getAllEmployerJobs);
router.get('/my-jobs/applications', authMiddleware, authorize(['Employer']), getMyJobsApplications);
router.get('/', getAllJobs);
router.get('/:id', getJobDetails);

module.exports = router;

