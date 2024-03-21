const express = require('express');
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

router.get('/', employeeController.getEmployee);
router.post('/add-employee', authMiddleware, employeeController.addEmployee);
router.put('/edit-employee/:id', employeeController.editEmployee)
router.delete('/delete-employee/:id', employeeController.deleteEmployee)


module.exports = router;
