// salaryRoutes.js

const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');

router.post('/add-salary', salaryController.createSalary);
router.post('/salaries', salaryController.createMultipleSalaries)
router.get('/', salaryController.getAllSalaries);
// Define other routes as needed

module.exports = router;
