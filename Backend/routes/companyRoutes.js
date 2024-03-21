const express = require('express');
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

router.get('/', companyController.getAllCompanies);
router.post('/create-company', authMiddleware, companyController.createCompany);
router.put('/edit-company/:id', companyController.editCompany);
router.delete('/delete-company/:id', companyController.deleteCompany);

router.put('/assign-company/:companyId/to-manager/:managerId', companyController.assignCompanyToManager);
module.exports = router;
