const express = require('express');
const router = express.Router();
const { register, login, updateProfile, viewProfile, viewUserProfile, changePassword } = require('../controllers/userControllers');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.patch('/profile', authMiddleware, authorize(['JobSeeker', 'Employer', 'Admin']), updateProfile);
router.get('/profile', authMiddleware, authorize(['JobSeeker', 'Employer', 'Admin']), viewProfile);
router.patch('/change-password', authMiddleware, authorize(['JobSeeker', 'Employer', 'Admin']), changePassword);//
router.get('/profile/:userId', authMiddleware, authorize([ 'Employer', 'Admin']), viewUserProfile);//

module.exports = router;
