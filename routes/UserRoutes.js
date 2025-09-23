const express = require('express');
const router = express.Router();
const { register, login, updateProfile, viewProfile, viewUserProfile, changePassword } = require('../controllers/userControllers');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.patch('/profile', authMiddleware, authorize(['jobSeeker', 'employer', 'admin']), updateProfile);
router.get('/profile', authMiddleware, authorize(['jobSeeker', 'employer', 'admin']), viewProfile);
router.get('/profile/:id', authMiddleware, authorize(['jobSeeker', 'employer', 'admin']), viewUserProfile);
router.patch('/change-password', authMiddleware, authorize(['jobSeeker', 'employer', 'admin']), changePassword);

module.exports = router;
