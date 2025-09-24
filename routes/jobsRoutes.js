const express = require('express');
const router = express.Router();
const { createJob, updateJob, deleteJob, getAllJobs, getAllEmployerJobs, getMyJobsApplications } = require('../controllers/jobsControllers');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/', authMiddleware,authorize['employer'], createJob);

router.put('/:id', authMiddleware, authorize['employer'], updateJob);

router.delete('/:id', authMiddleware, authorize['employer','admin'], deleteJob);

router.get('/', getAllJobs);
router.get('/my-jobs', authMiddleware, authorize['employer'], getAllEmployerJobs);

router.get('/my-jobs/applications', authMiddleware, authorize['employer'], getMyJobsApplications);

module.exports = router;

