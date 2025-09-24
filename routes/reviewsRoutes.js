const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth');
const { addReview, updateReview, deleteReview } = require('../controllers/reviewsControllers');

router.post('/', authMiddleware, authorize(['jobSeeker', 'employer', 'admin']), addReview);
router.patch('/:reviewId', authMiddleware, authorize(['jobSeeker', 'employer', 'admin']), updateReview);
router.delete('/:reviewId', authMiddleware, authorize(['jobSeeker', 'employer', 'admin']), deleteReview);

module.exports = router;
