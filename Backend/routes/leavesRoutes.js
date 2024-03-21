const express = require('express');
const leavesController = require('../controllers/leavesController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

router.get('/getAllLeaves', leavesController.getAllLeaves);
router.post('/add-leaves', authMiddleware, leavesController.addLeaves);
router.put('/edit-leave/:id', leavesController.editLeave)
router.delete('/delete-leave/:id', leavesController.deleteLeave)


module.exports = router;
