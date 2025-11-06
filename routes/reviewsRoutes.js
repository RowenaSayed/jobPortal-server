const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth');
const { addReview, updateReview, deleteReview } = require('../controllers/reviewsControllers');

router.post('/', authMiddleware, authorize(['JobSeeker', 'Employer', 'Admin']), addReview);
router.patch('/:reviewId', authMiddleware, authorize(['JobSeeker', 'Employer', 'Admin']), updateReview);
router.delete('/:reviewId', authMiddleware, authorize(['JobSeeker', 'Employer', 'Admin']), deleteReview);

module.exports = router;
