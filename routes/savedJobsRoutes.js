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

router.post('/', authMiddleware, authorize(['jobSeeker']), addSavedJob);
router.get('/', authMiddleware, authorize(['jobSeeker']), getMySavedJobs);
router.get('/:id', authMiddleware, authorize(['jobSeeker']), getSavedJobDetails);
router.delete('/:id', authMiddleware, authorize(['jobSeeker']), deleteSavedJob);

module.exports = router;
