const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth');
const { createCompany, updateCompany, viewCompany, viewUserCompany } = require('../controllers/companyControllers');

router.post('/', authMiddleware, authorize(['employer', 'admin']), createCompany);
router.patch('/', authMiddleware, authorize(['employer', 'admin']), updateCompany);
router.get('/', authMiddleware, authorize(['employer', 'admin']), viewCompany);
router.get('/:companyId', viewUserCompany);

module.exports = router;
