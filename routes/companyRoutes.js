const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth');
const { createCompany, updateCompany, viewCompany, viewUserCompany } = require('../controllers/CompanyControllers');

router.post('/', authMiddleware, authorize(['Employer', 'Admin']), createCompany);
router.patch('/', authMiddleware, authorize(['Employer', 'Admin']), updateCompany);
router.get('/', authMiddleware, authorize(['Employer', 'Admin']), viewCompany);//
router.get('/:companyId', viewUserCompany);//

module.exports = router;
