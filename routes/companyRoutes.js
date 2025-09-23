const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth');
const { createCompany, updateCompany, viewCompany, viewUserCompany } = require('../controllers/CompanyControllers');

router.post('/', authMiddleware, authorize(['employer', 'admin']), createCompany);
router.patch('/', authMiddleware, authorize(['employer', 'admin']), updateCompany);
router.get('/', authMiddleware, authorize(['employer', 'admin', 'jobSeeker']), viewCompany);
router.get('/:companyId', authMiddleware, authorize(['employer', 'admin', 'jobSeeker']), viewUserCompany);

module.exports = router;
