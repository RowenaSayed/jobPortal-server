const express = require('express');
const router = express.Router();
const { createJobAlert, getJobAlerts, updateJobAlert, deleteJobAlert } = require('../controllers/jobAlertControllers');
const { authMiddleware, authorize } = require('../middleware/auth');
router.post('/', authMiddleware, authorize(['Jobseeker', 'Admin']), createJobAlert);
router.get('/', authMiddleware, authorize(['Jobseeker', 'Admin']), getJobAlerts);
router.patch('/:id', authMiddleware, authorize(['Jobseeker', 'Admin']), updateJobAlert);
router.delete('/:id', authMiddleware, authorize(['Jobseeker', 'Admin']), deleteJobAlert);
module.exports = router;