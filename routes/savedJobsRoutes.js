const express = require('express');
const router = express.Router();
const {
    addSavedJob,
    deleteSavedJob,
    getMySavedJobs,
    getSavedJobDetails
} = require('../controllers/savedJobsControllers');
const { authMiddleware, authorize } = require('../middleware/auth');
// ====================================================================

router.post('/', authMiddleware, authorize(['JobSeeker']), addSavedJob);
router.get('/', authMiddleware, authorize(['JobSeeker']), getMySavedJobs);
router.get('/:id', authMiddleware, authorize(['JobSeeker']), getSavedJobDetails);
router.delete('/:id', authMiddleware, authorize(['JobSeeker']), deleteSavedJob);

module.exports = router;
